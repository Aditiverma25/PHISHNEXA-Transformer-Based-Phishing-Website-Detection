from fastapi import APIRouter, HTTPException, Query, Request
from models.scan import ScanRequest, ScanResult, FeedbackRequest, FeedbackResponse
from lib.url_analyzer import evaluate_url
from lib.db import db
from datetime import datetime
from typing import List, Optional

router = APIRouter(tags=["scans"])

@router.post("/predict", response_model=ScanResult)
@router.post("/scan", response_model=ScanResult)
async def scan_url(req: ScanRequest, request: Request):
    if not req.url or len(req.url.strip()) < 3:
        raise HTTPException(status_code=400, detail="Please enter a valid URL.")
    
    session_id = req.user_id or request.cookies.get("phish_session")
    model_name = req.model if req.model in ["DistilBERT", "BERT", "RoBERTa"] else "DistilBERT"
    
    eval_data = evaluate_url(req.url.strip(), model_name)
    scan_obj = ScanResult(
        **eval_data,
        user_id=session_id
    )
    
    scan_dict = scan_obj.model_dump()
    if req.save_history:
        await db.scans.insert_one(scan_dict)
        if session_id:
            await db.users.update_one({"id": session_id}, {"$inc": {"scans_count": 1}})
            
    return scan_obj

@router.get("/scans", response_model=List[ScanResult])
async def list_scans(
    search: Optional[str] = None,
    prediction: Optional[str] = None,
    sort: Optional[str] = "newest",
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    user_id: Optional[str] = None
):
    filter_query = {}
    if search:
        filter_query["url"] = {"$regex": search, "$options": "i"}
    if prediction and prediction.upper() != "ALL":
        filter_query["prediction"] = prediction.upper()
    if user_id:
        filter_query["user_id"] = user_id

    sort_field = "created_at"
    sort_direction = -1
    if sort == "oldest":
        sort_direction = 1
    elif sort == "highest_risk":
        sort_field = "risk_score"
        sort_direction = -1
    elif sort == "lowest_risk":
        sort_field = "risk_score"
        sort_direction = 1

    cursor = db.scans.find(filter_query).sort(sort_field, sort_direction).skip(skip).limit(limit)
    scans_list = await cursor.to_list(limit)
    return [ScanResult(**s) for s in scans_list]

@router.get("/scans/stats/summary")
async def get_scans_summary():
    total_scans = await db.scans.count_documents({})
    phishing_count = await db.scans.count_documents({"prediction": "PHISHING"})
    legitimate_count = await db.scans.count_documents({"prediction": "LEGITIMATE"})
    suspicious_count = await db.scans.count_documents({"prediction": "SUSPICIOUS"})

    # Fetch recent 5 scans
    recent_cursor = db.scans.find().sort("created_at", -1).limit(5)
    recent_scans = await recent_cursor.to_list(5)

    return {
        "is_demo_data": True,
        "total_scans": total_scans if total_scans > 0 else 1284,
        "phishing_detected": phishing_count if phishing_count > 0 else 317,
        "legitimate_urls": legitimate_count if legitimate_count > 0 else 967,
        "suspicious_urls": suspicious_count if suspicious_count > 0 else 42,
        "avg_confidence": 94.6,
        "recent_scans": [ScanResult(**s) for s in recent_scans]
    }

@router.get("/scans/{scan_id}", response_model=ScanResult)
async def get_scan_by_id(scan_id: str):
    scan_doc = await db.scans.find_one({"id": scan_id})
    if not scan_doc:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    return ScanResult(**scan_doc)

@router.delete("/scans/{scan_id}")
async def delete_scan(scan_id: str):
    res = await db.scans.delete_one({"id": scan_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    return {"success": True, "message": "Scan record deleted."}

@router.post("/scans/{scan_id}/feedback", response_model=FeedbackResponse)
async def submit_feedback(scan_id: str, feedback_data: FeedbackRequest):
    scan_doc = await db.scans.find_one({"id": scan_id})
    if not scan_doc:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    
    # Update scan feedback
    await db.scans.update_one({"id": scan_id}, {"$set": {"feedback": feedback_data.feedback}})
    
    # Store feedback in separate collection for isolated analysis (without automated retraining)
    feedback_record = {
        "scan_id": scan_id,
        "url": scan_doc.get("url"),
        "predicted_label": scan_doc.get("prediction"),
        "user_feedback": feedback_data.feedback,
        "user_label": feedback_data.user_label,
        "notes": feedback_data.notes,
        "timestamp": datetime.utcnow()
    }
    await db.feedback.insert_one(feedback_record)
    
    return FeedbackResponse(
        success=True,
        message="Feedback logged successfully. Stored in isolated research repository.",
        scan_id=scan_id,
        feedback=feedback_data.feedback
    )
