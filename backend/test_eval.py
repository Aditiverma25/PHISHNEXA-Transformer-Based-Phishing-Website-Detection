import time
from lib.url_analyzer import evaluate_url

test_cases = [
    # Legitimate (MUST BE LEGITIMATE)
    ("https://www.paypal.com/signin", "LEGITIMATE"),
    ("https://github.com/login", "LEGITIMATE"),
    ("https://accounts.google.com", "LEGITIMATE"),
    ("https://login.microsoftonline.com", "LEGITIMATE"),
    ("https://github.com/Aditiverma25", "LEGITIMATE"),
    ("https://www.amazon.in/gp/sign-in", "LEGITIMATE"), # Issue 1 FIX

    # Phishing (MUST BE PHISHING)
    ("http://paypal-login-verification.example.test/secure/account", "PHISHING"),
    ("http://paypal.com.login.example.test/account", "PHISHING"),
    ("http://amazon-security-alert.example.test/update", "PHISHING"),
    ("http://google.com.verify.example.test", "PHISHING"),
    ("http://appleid.example.test/signin", "PHISHING"),
    ("http://secure-banking.example.test", "PHISHING"),
    ("http://paypal.example.test@192.0.2.10", "PHISHING"),
    ("http://account-update.example.test/verify?session=123", "PHISHING"),

    # Suspicious IP (MUST BE SUSPICIOUS)
    ("http://192.0.2.10/login", "SUSPICIOUS") # Issue 2 FIX
]

print("=" * 80)
print(f"{'URL':<58} | {'PRED':<10} | {'EXP':<10} | {'RISK':<5} | {'CONF':<6} | {'TIME'}")
print("=" * 80)

all_passed = True
for url, expected in test_cases:
    t0 = time.time()
    res = evaluate_url(url)
    elapsed_ms = (time.time() - t0) * 1000

    pred = res["prediction"]
    risk = res["risk_score"]
    conf = res["confidence"]
    passed = (pred == expected)
    if not passed:
        all_passed = False

    status = "OK" if passed else "FAIL"
    print(f"{url:<58} | {pred:<10} | {expected:<10} | {risk:<5} | {conf*100:<5.1f}% | {elapsed_ms:.1f}ms [{status}]")

print("=" * 80)
if all_passed:
    print(">>> ALL 15 TEST CASES PASSED SUCCESSFULLY! <<<")
else:
    print(">>> SOME TEST CASES FAILED! <<<")
