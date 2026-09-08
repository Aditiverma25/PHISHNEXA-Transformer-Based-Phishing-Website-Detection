from fastapi import APIRouter, HTTPException
from models.batch import BatchScanRequest, BatchScanResponse, BatchItemResult
from lib.url_analyzer import evaluate_url
from lib.db import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/batch", tags=["batch"])

@router.post("/scan", response_model=BatchScanResponse)
async def process_batch_scan(req: BatchScanRequest):
    if not req.urls:
        raise HTTPException(status_code=400, detail="No URLs provided in batch request.")
    
    clean_urls = [u.strip() for u in req.urls if u.strip()][:50]
    if not clean_urls:
        raise HTTPException(status_code=400, detail="Provided URL list was empty or invalid.")

    results: list[BatchItemResult] = []
    phish_cnt = 0
    legit_cnt = 0
    susp_cnt = 0
    total_risk = 0
    total_latency = 0.0

    for raw_u in clean_urls:
        eval_data = evaluate_url(raw_u, req.model)
        item = BatchItemResult(
            id=str(uuid.uuid4()),
            url=raw_u,
            prediction=eval_data["prediction"],
            risk_score=eval_data["risk_score"],
            confidence=eval_data["confidence"],
            risk_level=eval_data["risk_level"],
            indicators_count=len(eval_data["indicators"]),
            inference_time_ms=eval_data["inference_time_ms"]
        )
        results.append(item)
        if item.prediction == "PHISHING":
            phish_cnt += 1
        elif item.prediction == "LEGITIMATE":
            legit_cnt += 1
        else:
            susp_cnt += 1
        total_risk += item.risk_score
        total_latency += item.inference_time_ms

    total_n = len(results)
    avg_risk = round(total_risk / total_n, 1) if total_n > 0 else 0.0
    avg_ms = round(total_latency / total_n, 1) if total_n > 0 else 0.0

    return BatchScanResponse(
        batch_id=str(uuid.uuid4()),
        total_processed=total_n,
        phishing_count=phish_cnt,
        legitimate_count=legit_cnt,
        suspicious_count=susp_cnt,
        avg_risk_score=avg_risk,
        avg_inference_ms=avg_ms,
        model_used=req.model,
        results=results
    )
