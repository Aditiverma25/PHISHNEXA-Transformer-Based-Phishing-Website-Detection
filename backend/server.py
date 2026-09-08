from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
from lib.db import client, db

# Import Routers
from routers.auth import router as auth_router
from routers.scans import router as scans_router
from routers.batch import router as batch_router
from routers.labs import router as labs_router
from routers.benchmarks import router as benchmarks_router

# Import ML Engine & Seed helper
from lib.ml_model import ml_engine
from seed import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform DB check & auto seed on startup
    await db.check_connection()
    try:
        scan_count = await db.scans.count_documents({})
        if scan_count == 0:
            logger.info("Initializing demo data seed...")
            await seed()
    except Exception as e:
        logger.warning(f"Auto-seed check note: {e}")
    yield
    client.close()

# Create the main app without a prefix
app = FastAPI(
    title="PHISHNEXA API",
    description="Transformer-Based Phishing Website Detection and URL Classification API",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Root status
@api_router.get("/")
async def root():
    return {
        "app": "PHISHNEXA",
        "tagline": "Transformer Intelligence for Safer Web Navigation",
        "status": "operational",
        "default_model": "DistilBERT",
        "models_available": ["DistilBERT", "BERT", "RoBERTa"],
        "mode": "Demo Mode & Live Feature Extraction"
    }

# Include all sub-routers under api_router
api_router.include_router(auth_router)
api_router.include_router(scans_router)
api_router.include_router(batch_router)
api_router.include_router(labs_router)
api_router.include_router(benchmarks_router)

# Include the api_router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
