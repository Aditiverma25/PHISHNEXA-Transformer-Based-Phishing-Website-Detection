import os
import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

mongo_url = os.environ.get("MONGO_URL") or os.environ.get("MONGO_URI") or "mongodb://localhost:27017"
db_name = os.environ.get("DB_NAME", "phishnexa")

class InMemoryCursor:
    def __init__(self, data: List[Dict[str, Any]], filter_query: Optional[Dict[str, Any]] = None):
        self.data = data
        self.filter_query = filter_query or {}
        self._sort_field = None
        self._sort_dir = -1
        self._skip = 0
        self._limit = None

    def sort(self, key_or_list, direction=None):
        if isinstance(key_or_list, list):
            if key_or_list:
                self._sort_field, self._sort_dir = key_or_list[0]
        else:
            self._sort_field = key_or_list
            self._sort_dir = direction if direction is not None else 1
        return self

    def skip(self, skip_count: int):
        self._skip = max(0, skip_count)
        return self

    def limit(self, limit_count: int):
        self._limit = limit_count
        return self

    async def to_list(self, length: Optional[int] = None):
        filtered = []
        for item in self.data:
            match = True
            for k, v in self.filter_query.items():
                if isinstance(v, dict) and "$regex" in v:
                    pattern = v["$regex"]
                    flags = v.get("$options", "")
                    import re
                    regex_flags = re.IGNORECASE if "i" in flags else 0
                    if not re.search(pattern, str(item.get(k, "")), regex_flags):
                        match = False
                        break
                elif item.get(k) != v:
                    match = False
                    break
            if match:
                filtered.append(item)

        if self._sort_field:
            def sort_key(x):
                val = x.get(self._sort_field)
                if val is None:
                    return "" if isinstance(val, str) else 0
                return val
            filtered.sort(key=sort_key, reverse=(self._sort_dir == -1))

        sliced = filtered[self._skip:]
        lim = length if length is not None else self._limit
        if lim is not None:
            sliced = sliced[:lim]

        # Convert datetime objects if needed
        return sliced

class InMemoryCollection:
    def __init__(self, name: str):
        self.name = name
        self.docs: List[Dict[str, Any]] = []

    async def insert_one(self, doc: Dict[str, Any]):
        doc_copy = dict(doc)
        if "created_at" not in doc_copy:
            doc_copy["created_at"] = datetime.utcnow()
        self.docs.append(doc_copy)
        return type("InsertResult", (), {"inserted_id": doc_copy.get("id")})()

    async def find_one(self, filter_query: Dict[str, Any]):
        for doc in self.docs:
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    async def update_one(self, filter_query: Dict[str, Any], update_data: Dict[str, Any]):
        doc = await self.find_one(filter_query)
        if not doc:
            return type("UpdateResult", (), {"modified_count": 0})()

        # Find target in array
        for item in self.docs:
            match = True
            for k, v in filter_query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                if "$inc" in update_data:
                    for ik, iv in update_data["$inc"].items():
                        item[ik] = item.get(ik, 0) + iv
                if "$set" in update_data:
                    for sk, sv in update_data["$set"].items():
                        item[sk] = sv
                return type("UpdateResult", (), {"modified_count": 1})()

        return type("UpdateResult", (), {"modified_count": 0})()

    async def delete_one(self, filter_query: Dict[str, Any]):
        for idx, doc in enumerate(self.docs):
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                self.docs.pop(idx)
                return type("DeleteResult", (), {"deleted_count": 1})()
        return type("DeleteResult", (), {"deleted_count": 0})()

    async def delete_many(self, filter_query: Dict[str, Any]):
        if not filter_query:
            count = len(self.docs)
            self.docs.clear()
            return type("DeleteResult", (), {"deleted_count": count})()
        
        new_docs = []
        deleted = 0
        for doc in self.docs:
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                deleted += 1
            else:
                new_docs.append(doc)
        self.docs = new_docs
        return type("DeleteResult", (), {"deleted_count": deleted})()

    async def count_documents(self, filter_query: Dict[str, Any]):
        if not filter_query:
            return len(self.docs)
        count = 0
        for doc in self.docs:
            match = True
            for k, v in filter_query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                count += 1
        return count

    def find(self, filter_query: Optional[Dict[str, Any]] = None):
        return InMemoryCursor(self.docs, filter_query)

class DatabaseWrapper:
    def __init__(self):
        self.is_connected = False
        self._motor_client = None
        self._motor_db = None
        self.in_memory_collections: Dict[str, InMemoryCollection] = {
            "users": InMemoryCollection("users"),
            "scans": InMemoryCollection("scans"),
            "feedback": InMemoryCollection("feedback")
        }
        self.try_connect_mongo()

    def try_connect_mongo(self):
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            self._motor_client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=500)
            self._motor_db = self._motor_client[db_name]
        except Exception as e:
            logger.warning(f"MongoDB client init warning: {e}. Using in-memory store.")
            self.is_connected = False

    async def check_connection(self):
        if self._motor_client:
            try:
                await asyncio.wait_for(self._motor_client.admin.command('ping'), timeout=0.5)
                self.is_connected = True
                logger.info("Successfully connected to MongoDB server.")
                return True
            except Exception:
                self.is_connected = False
                logger.info("MongoDB not reachable. Using resilient in-memory database store.")
                return False
        return False

    def __getattr__(self, name: str):
        if self.is_connected and self._motor_db is not None:
            return getattr(self._motor_db, name)
        if name not in self.in_memory_collections:
            self.in_memory_collections[name] = InMemoryCollection(name)
        return self.in_memory_collections[name]

    def close(self):
        if self._motor_client and self.is_connected:
            self._motor_client.close()

db_wrapper = DatabaseWrapper()
client = db_wrapper
db = db_wrapper

