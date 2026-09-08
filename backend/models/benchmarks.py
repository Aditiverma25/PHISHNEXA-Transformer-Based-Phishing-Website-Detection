from pydantic import BaseModel, Field
from typing import List, Dict, Any

class ModelMetric(BaseModel):
    model_id: str
    name: str
    architecture: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    false_positive_rate: float
    avg_latency_ms: float
    parameters: str
    vocab_size: str

class ConfusionMatrix(BaseModel):
    model_id: str
    true_positive: int
    false_positive: int
    true_negative: int
    false_negative: int

class CurvePoint(BaseModel):
    x: float
    y: float
    model_id: str

class BenchmarkReport(BaseModel):
    evaluation_label: str = "Demo Evaluation Data"
    total_test_samples: int = 50000
    dataset_description: str
    models: List[ModelMetric]
    confusion_matrices: List[ConfusionMatrix]
    roc_curve: List[CurvePoint]
    pr_curve: List[CurvePoint]
    feature_importance: List[Dict[str, Any]]
