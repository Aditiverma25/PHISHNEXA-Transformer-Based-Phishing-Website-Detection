from fastapi import APIRouter
from models.benchmarks import BenchmarkReport, ModelMetric, ConfusionMatrix, CurvePoint

router = APIRouter(prefix="/benchmarks", tags=["benchmarks"])

@router.get("", response_model=BenchmarkReport)
async def get_benchmarks():
    # Research evaluation data (labeled Demo Evaluation Data)
    models = [
        ModelMetric(
            model_id="distilbert",
            name="DistilBERT (PhishBERT-Fast)",
            architecture="6-layer Transformer Encoder (768-dim, 12-heads)",
            accuracy=97.4,
            precision=96.8,
            recall=98.1,
            f1_score=97.4,
            roc_auc=0.991,
            false_positive_rate=1.8,
            avg_latency_ms=18.4,
            parameters="66 Million",
            vocab_size="30,522 WordPiece"
        ),
        ModelMetric(
            model_id="bert",
            name="BERT-Base-Uncased",
            architecture="12-layer Bidirectional Transformer (768-dim, 12-heads)",
            accuracy=98.7,
            precision=98.2,
            recall=99.1,
            f1_score=98.6,
            roc_auc=0.996,
            false_positive_rate=1.2,
            avg_latency_ms=45.2,
            parameters="110 Million",
            vocab_size="30,522 WordPiece"
        ),
        ModelMetric(
            model_id="roberta",
            name="RoBERTa-Phish-Large",
            architecture="24-layer Robustly Optimized Transformer (1024-dim, 16-heads)",
            accuracy=99.1,
            precision=98.9,
            recall=99.3,
            f1_score=99.1,
            roc_auc=0.998,
            false_positive_rate=0.9,
            avg_latency_ms=62.8,
            parameters="355 Million",
            vocab_size="50,265 Byte-Pair"
        )
    ]

    confusion_matrices = [
        ConfusionMatrix(
            model_id="distilbert",
            true_positive=24525,
            false_positive=450,
            true_negative=24175,
            false_negative=850
        ),
        ConfusionMatrix(
            model_id="bert",
            true_positive=24775,
            false_positive=300,
            true_negative=24550,
            false_negative=375
        ),
        ConfusionMatrix(
            model_id="roberta",
            true_positive=24825,
            false_positive=225,
            true_negative=24700,
            false_negative=250
        )
    ]

    # ROC curve points (FPR vs TPR)
    roc_curve = []
    fpr_steps = [0.0, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.0]
    for fpr in fpr_steps:
        # DistilBERT
        tpr_d = 0.0 if fpr == 0 else min(1.0, 0.85 + (0.14 * (1 - (1 - fpr)**2)))
        roc_curve.append(CurvePoint(x=round(fpr, 3), y=round(tpr_d, 3), model_id="distilbert"))
        # BERT
        tpr_b = 0.0 if fpr == 0 else min(1.0, 0.89 + (0.10 * (1 - (1 - fpr)**2)))
        roc_curve.append(CurvePoint(x=round(fpr, 3), y=round(tpr_b, 3), model_id="bert"))
        # RoBERTa
        tpr_r = 0.0 if fpr == 0 else min(1.0, 0.93 + (0.068 * (1 - (1 - fpr)**2)))
        roc_curve.append(CurvePoint(x=round(fpr, 3), y=round(tpr_r, 3), model_id="roberta"))

    # PR curve points (Recall vs Precision)
    pr_curve = []
    recall_steps = [0.1, 0.3, 0.5, 0.7, 0.85, 0.92, 0.96, 0.99, 1.0]
    for rec in recall_steps:
        pr_curve.append(CurvePoint(x=round(rec, 3), y=round(max(0.85, 0.995 - (rec * 0.03)), 3), model_id="distilbert"))
        pr_curve.append(CurvePoint(x=round(rec, 3), y=round(max(0.89, 0.998 - (rec * 0.015)), 3), model_id="bert"))
        pr_curve.append(CurvePoint(x=round(rec, 3), y=round(max(0.92, 0.999 - (rec * 0.008)), 3), model_id="roberta"))

    feature_importance = [
        {"feature": "Contextual Token Attention (Transformer Encoder)", "importance": 0.88, "type": "Deep Contextual"},
        {"feature": "Brand Lookalike / Levenshtein Proximity", "importance": 0.82, "type": "Structural"},
        {"feature": "Punycode & Homoglyph Anomaly", "importance": 0.79, "type": "Lexical"},
        {"feature": "Subdomain Depth & Path Redirection Count", "importance": 0.74, "type": "Structural"},
        {"feature": "Shannon Character Entropy", "importance": 0.71, "type": "Statistical"},
        {"feature": "Security Keyword Token Frequency", "importance": 0.68, "type": "Lexical"},
        {"feature": "TLD Registration Reputation Index", "importance": 0.61, "type": "External Context"}
    ]

    return BenchmarkReport(
        evaluation_label="Demo Evaluation Data",
        total_test_samples=50000,
        dataset_description="Stratified dataset of 50,000 URLs (25,000 malicious from PhishTank/OpenPhish/APWG + 25,000 legitimate from Tranco/Alexa Top 10K).",
        models=models,
        confusion_matrices=confusion_matrices,
        roc_curve=roc_curve,
        pr_curve=pr_curve,
        feature_importance=feature_importance
    )
