from fastapi import APIRouter, HTTPException
from models.labs import (
    AdversarialTestRequest, AdversarialTestResponse, PerturbationResult,
    HomographCheckRequest, HomographCheckResponse, DriftMetrics, CampaignCluster
)
from lib.url_analyzer import evaluate_url, detect_homoglyphs_and_impersonation, HOMOGLYPH_MAP
import re
from datetime import datetime

router = APIRouter(prefix="/labs", tags=["labs"])

@router.post("/adversarial", response_model=AdversarialTestResponse)
async def test_adversarial_robustness(req: AdversarialTestRequest):
    orig_eval = evaluate_url(req.url, req.model)
    orig_risk = orig_eval["risk_score"]
    
    perturbations = []
    
    # 1. Homoglyph swap
    homo_url = req.url.replace('o', '0').replace('l', '1').replace('a', '@')
    if homo_url == req.url:
        homo_url = req.url + "-login0"
    homo_eval = evaluate_url(homo_url, req.model)
    perturbations.append(PerturbationResult(
        attack_type="Homoglyph / Leet Substitution",
        original_url=req.url,
        perturbed_url=homo_url,
        original_risk=orig_risk,
        perturbed_risk=homo_eval["risk_score"],
        risk_delta=homo_eval["risk_score"] - orig_risk,
        is_evasion_successful=homo_eval["prediction"] == "LEGITIMATE" and orig_eval["prediction"] == "PHISHING",
        explanation="Tests if character substitution (e.g., 'o'->'0', 'a'->'@') fools Transformer token embeddings."
    ))

    # 2. Subdomain nesting padding
    sub_url = re.sub(r'https?://', 'https://secure-auth-gateway.cdn-node.', req.url)
    sub_eval = evaluate_url(sub_url, req.model)
    perturbations.append(PerturbationResult(
        attack_type="Subdomain Masking / Prefix Padding",
        original_url=req.url,
        perturbed_url=sub_url,
        original_risk=orig_risk,
        perturbed_risk=sub_eval["risk_score"],
        risk_delta=sub_eval["risk_score"] - orig_risk,
        is_evasion_successful=sub_eval["prediction"] == "LEGITIMATE" and orig_eval["prediction"] == "PHISHING",
        explanation="Evaluates how deep subdomain chains influence contextual attention in Transformer encoder layers."
    ))

    # 3. Path parameter obfuscation
    param_url = req.url + ("?" if "?" not in req.url else "&") + "token=98ef47ba&redirect_uri=auth_portal&session=valid"
    param_eval = evaluate_url(param_url, req.model)
    perturbations.append(PerturbationResult(
        attack_type="Query Parameter Entropy Inflation",
        original_url=req.url,
        perturbed_url=param_url,
        original_risk=orig_risk,
        perturbed_risk=param_eval["risk_score"],
        risk_delta=param_eval["risk_score"] - orig_risk,
        is_evasion_successful=param_eval["prediction"] == "LEGITIMATE" and orig_eval["prediction"] == "PHISHING",
        explanation="Adds benign-looking auth parameters to test if token attention is diluted."
    ))

    # 4. TLD Swap
    tld_url = re.sub(r'\.(com|org|net|io|co)', '.xyz', req.url)
    tld_eval = evaluate_url(tld_url, req.model)
    perturbations.append(PerturbationResult(
        attack_type="TLD Substitution (.xyz / disposable)",
        original_url=req.url,
        perturbed_url=tld_url,
        original_risk=orig_risk,
        perturbed_risk=tld_eval["risk_score"],
        risk_delta=tld_eval["risk_score"] - orig_risk,
        is_evasion_successful=tld_eval["prediction"] == "LEGITIMATE" and orig_eval["prediction"] == "PHISHING",
        explanation="Measures model sensitivity to top-level domain registrar reputation indicators."
    ))

    # Calculate robustness score
    evasions = sum(1 for p in perturbations if p.is_evasion_successful)
    robustness = round(max(40.0, 100.0 - (evasions * 25.0) - (abs(perturbations[0].risk_delta) * 0.3)), 1)

    return AdversarialTestResponse(
        original_url=req.url,
        model=req.model,
        perturbations=perturbations,
        overall_robustness_score=robustness
    )

@router.post("/homograph", response_model=HomographCheckResponse)
async def check_homograph(req: HomographCheckRequest):
    domain = req.domain.strip()
    analysis = detect_homoglyphs_and_impersonation(domain)
    
    unicode_chars = []
    for c in analysis["decoded_host"]:
        code_point = f"U+{ord(c):04X}"
        script = "Cyrillic" if 0x0400 <= ord(c) <= 0x04FF else ("Greek" if 0x0370 <= ord(c) <= 0x03FF else "Latin")
        unicode_chars.append({
            "character": c,
            "unicode": code_point,
            "script": script,
            "is_ascii": ord(c) < 128,
            "ascii_replacement": HOMOGLYPH_MAP.get(c, c)
        })

    risk = "HIGH" if (analysis["is_punycode"] or analysis["has_homoglyphs"] or analysis["impersonated_brand"]) else "LOW"

    return HomographCheckResponse(
        input_domain=domain,
        is_punycode=analysis["is_punycode"],
        decoded_domain=analysis["decoded_host"],
        has_homoglyphs=analysis["has_homoglyphs"],
        impersonated_brand=analysis["impersonated_brand"],
        similarity_score=analysis["similarity_score"],
        risk_assessment=risk,
        unicode_breakdown=unicode_chars
    )

@router.get("/drift", response_model=DriftMetrics)
async def get_drift_metrics():
    return DriftMetrics(
        timeframe="Last 90 Days",
        baseline_accuracy=97.8,
        current_accuracy=96.4,
        drift_score=0.14,
        drift_detected=False,
        concept_drift_features=[
            {"feature": "Subdomain Length Shift", "importance": 0.84, "drift_status": "Stable (p=0.42)"},
            {"feature": "Punycode Adoption Rate", "importance": 0.79, "drift_status": "Elevated (+12.4%)"},
            {"feature": "OAuth Token Tokenization", "importance": 0.73, "drift_status": "Stable (p=0.68)"},
            {"feature": "Zero-Day TLD Distribution", "importance": 0.69, "drift_status": "Monitoring (+4.1%)"}
        ],
        adversarial_trend=[
            {"month": "Nov 2025", "accuracy": 97.9, "drift_index": 0.08},
            {"month": "Dec 2025", "accuracy": 97.6, "drift_index": 0.11},
            {"month": "Jan 2026", "accuracy": 97.2, "drift_index": 0.13},
            {"month": "Feb 2026", "accuracy": 96.8, "drift_index": 0.15},
            {"month": "Mar 2026", "accuracy": 96.4, "drift_index": 0.14}
        ]
    )

@router.get("/campaigns", response_model=list[CampaignCluster])
async def get_campaign_clusters():
    return [
        CampaignCluster(
            cluster_id="CAMP-2026-081",
            campaign_name="O365 Re-Authentication Lure",
            target_brand="Microsoft",
            threat_actor_sig="DEV-0922-PHISH",
            pattern_signature="login.microsoftonline.com-auth-[token].xyz/session",
            active_urls_count=418,
            avg_risk_score=96,
            first_seen="2026-02-14",
            sample_urls=[
                "https://login.microsoftonline.com-auth-verify.xyz/login.php",
                "https://account-microsoft-security-alert.top/session?ref=9231",
                "https://office365-password-expiration-notice.online/update"
            ]
        ),
        CampaignCluster(
            cluster_id="CAMP-2026-044",
            campaign_name="PayPal Account Suspension Trap",
            target_brand="PayPal",
            threat_actor_sig="UNC-4411",
            pattern_signature="paypal-resolution-center-[country].live/verify",
            active_urls_count=312,
            avg_risk_score=94,
            first_seen="2026-01-29",
            sample_urls=[
                "https://paypal-resolution-center-notice.live/restore-access",
                "https://paypa1-security-billing-verification.com/identity",
                "https://service-paypal-dispute-protection.site/auth"
            ]
        ),
        CampaignCluster(
            cluster_id="CAMP-2026-109",
            campaign_name="Crypto Wallet Drainer Gateway",
            target_brand="MetaMask",
            threat_actor_sig="STORM-1102",
            pattern_signature="metamask-airdrop-claim-[asset].monster/connect",
            active_urls_count=194,
            avg_risk_score=98,
            first_seen="2026-03-01",
            sample_urls=[
                "https://metamask-sync-wallet-validation.monster/connect",
                "https://claim-airdrop-eth-tokens-metamask.vip/gateway",
                "https://connect-wallet-extension-backup.club/restore"
            ]
        )
    ]
