from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class AdversarialTestRequest(BaseModel):
    url: str
    model: str = "DistilBERT"
    attack_types: List[str] = ["homoglyph", "subdomain_padding", "path_obfuscation", "tld_swap"]

class PerturbationResult(BaseModel):
    attack_type: str
    original_url: str
    perturbed_url: str
    original_risk: int
    perturbed_risk: int
    risk_delta: int
    is_evasion_successful: bool
    explanation: str

class AdversarialTestResponse(BaseModel):
    original_url: str
    model: str
    perturbations: List[PerturbationResult]
    overall_robustness_score: float
    tested_at: datetime = Field(default_factory=datetime.utcnow)

class HomographCheckRequest(BaseModel):
    domain: str

class HomographCheckResponse(BaseModel):
    input_domain: str
    is_punycode: bool
    decoded_domain: str
    has_homoglyphs: bool
    impersonated_brand: Optional[str]
    similarity_score: float
    risk_assessment: str
    unicode_breakdown: List[Dict[str, Any]]

class DriftMetrics(BaseModel):
    timeframe: str
    baseline_accuracy: float
    current_accuracy: float
    drift_score: float
    drift_detected: bool
    concept_drift_features: List[Dict[str, Any]]
    adversarial_trend: List[Dict[str, Any]]

class CampaignCluster(BaseModel):
    cluster_id: str
    campaign_name: str
    target_brand: str
    threat_actor_sig: str
    pattern_signature: str
    active_urls_count: int
    avg_risk_score: int
    first_seen: str
    sample_urls: List[str]
