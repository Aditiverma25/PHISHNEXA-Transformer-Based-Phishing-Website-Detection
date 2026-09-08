from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

class ScanRequest(BaseModel):
    url: str
    model: str = "DistilBERT"
    user_id: Optional[str] = None
    save_history: bool = True

class URLAnatomy(BaseModel):
    full_url: str
    normalized_url: str
    protocol: str
    has_https: bool
    host: str
    domain: str
    subdomain: str
    tld: str
    port: str
    path: str
    query: str
    fragment: str
    num_params: int
    url_length: int
    domain_length: int
    path_length: int
    entropy: float
    special_chars_count: int
    digits_count: int
    is_ip_host: bool

class TokenAttentionItem(BaseModel):
    token: str
    position: int
    attention_weight: float
    is_suspicious: bool
    embedding_dim: int = 768

class ThreatIndicatorItem(BaseModel):
    id: str
    title: str
    severity: str
    weight: int
    description: str
    recommendation: str

class CounterfactualItem(BaseModel):
    factor: str
    delta_risk: int
    explanation: str

class ModelConsensusItem(BaseModel):
    prediction: str
    confidence: float
    latency_ms: int
    risk_score: int

class ScanResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    prediction: str
    risk_level: str
    risk_score: int
    confidence: float
    model_name: str
    inference_time_ms: float
    threshold: float = 0.50
    is_demo_analysis: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    anatomy: Dict[str, Any]
    tokens: List[Dict[str, Any]]
    indicators: List[Dict[str, Any]]
    counterfactuals: List[Dict[str, Any]]
    consensus: Dict[str, Dict[str, Any]]
    consensus_agreement: float
    novelty_score: float
    robustness_score: float
    homoglyph_analysis: Dict[str, Any]
    user_id: Optional[str] = None
    feedback: Optional[str] = None

class FeedbackRequest(BaseModel):
    feedback: str # "correct" or "incorrect"
    notes: Optional[str] = None
    user_label: Optional[str] = None

class FeedbackResponse(BaseModel):
    success: bool
    message: str
    scan_id: str
    feedback: str
