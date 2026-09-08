import asyncio
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
from lib.db import db
from lib.url_analyzer import evaluate_url

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SAMPLE_URLS = [
    # Phishing Samples
    ("https://paypa1-account-security-verification.com/login/auth?session=expired", "DistilBERT"),
    ("https://login.microsoftonline.com-auth-verify.xyz/login.php?ref=mail", "BERT"),
    ("http://192.168.1.104/bankofamerica-online-banking/update.html", "DistilBERT"),
    ("https://metamask-sync-wallet-validation.monster/connect?claim=eth", "RoBERTa"),
    ("https://appleid.apple.com-verify-account-device.info/security", "DistilBERT"),
    ("https://chase-security-fraud-alert-notice.top/signin", "BERT"),
    ("http://amaz0n-prime-order-confirmation.live/billing-update", "DistilBERT"),
    ("https://netflix-membership-renewal-payment.site/update-card", "RoBERTa"),

    # Legitimate Samples
    ("https://github.com/torvalds/linux", "DistilBERT"),
    ("https://www.google.com/search?q=transformer+cybersecurity", "BERT"),
    ("https://developer.mozilla.org/en-US/docs/Web/HTTP", "DistilBERT"),
    ("https://stripe.com/docs/api", "RoBERTa"),
    ("https://stackoverflow.com/questions/tagged/python", "DistilBERT"),
    ("https://en.wikipedia.org/wiki/Phishing", "BERT"),
    ("https://aws.amazon.com/security", "DistilBERT"),

    # Suspicious Samples
    ("https://auth-portal.cdn-distribution-network.live/gateway?token=ab481", "DistilBERT"),
    ("https://support-ticket-update-session.club/ticket/9842", "RoBERTa"),
    ("http://download-free-security-update-tool.xyz/setup.exe", "DistilBERT")
]

async def seed():
    print("Starting PHISHNEXA database seeding...")
    
    # 1. Seed demo user
    demo_email = "analyst@phishnexa.ai"
    user_doc = await db.users.find_one({"email": demo_email})
    if not user_doc:
        user_id = str(uuid.uuid4())
        hashed_password = pwd_context.hash("CyberSec2026!")
        user_doc = {
            "id": user_id,
            "email": demo_email,
            "name": "SOC Lead Analyst",
            "role": "lead_analyst",
            "password_hash": hashed_password,
            "api_key": "phish_nex_9938472819",
            "created_at": datetime.utcnow() - timedelta(days=30),
            "scans_count": len(SAMPLE_URLS)
        }
        await db.users.insert_one(user_doc)
        print(f"Created demo user: {demo_email}")
    else:
        user_id = user_doc["id"]
        print(f"Existing demo user found: {demo_email}")

    # 2. Seed scans
    await db.scans.delete_many({}) # Clear scans for clean seed
    
    for idx, (url, model_name) in enumerate(SAMPLE_URLS):
        eval_data = evaluate_url(url, model_name)
        scan_id = str(uuid.uuid4())
        created_time = datetime.utcnow() - timedelta(hours=idx * 4, minutes=idx * 17)
        
        scan_record = {
            "id": scan_id,
            **eval_data,
            "created_at": created_time,
            "user_id": user_id,
            "feedback": "correct" if idx % 4 != 0 else None
        }
        await db.scans.insert_one(scan_record)

    total_scans = await db.scans.count_documents({})
    print(f"Seeded {total_scans} sample scans successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
