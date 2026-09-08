from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

class BatchScanRequest(BaseModel):
    urls: List[str]
    model: str = "DistilBERT"
    user_id: Optional[str] = None

class BatchItemResult(BaseModel):
    id: str
    url: str
    prediction: str
    risk_score: int
    confidence: float
    risk_level: str
    indicators_count: int
    inference_time_ms: float

class BatchScanResponse(BaseModel):
    batch_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    total_processed: int
    phishing_count: int
    legitimate_count: int
    suspicious_count: int
    avg_risk_score: float
    avg_inference_ms: float
    model_used: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    results: List[BatchItemResult]
