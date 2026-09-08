import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, Search, ArrowRight, RotateCcw, AlertCircle, Sparkles, Cpu, Layers } from "lucide-react";
import { toast } from "sonner";
import { ScanningAnimation } from "@/components/scanner/ScanningAnimation";
import { apiPost } from "@/lib/api";
import type { ScanResult, ModelType } from "@/types";

interface UrlScannerProps {
  onScanResult?: (result: ScanResult) => void;
  compact?: boolean;
}

export const PRESET_URLS = [
  {
    label: "Fake PayPal Billing (Phishing)",
    url: "https://paypa1-account-security-verification.com/login/auth?session=expired",
    type: "phishing",
    desc: "Targeted brand impersonation & lookalike domain typosquatting"
  },
  {
    label: "Fake Microsoft O365 (Phishing)",
    url: "https://login.microsoftonline.com-auth-verify.xyz/login.php?ref=mail",
    type: "phishing",
    desc: "Subdomain deception + suspicious .xyz TLD"
  },
  {
    label: "IP-Hosted Banking (Phishing)",
    url: "http://192.168.1.104/bankofamerica-online-banking/update.html",
    type: "phishing",
    desc: "Direct IP address host with cleartext HTTP"
  },
  {
    label: "Crypto Drainer Gateway (Phishing)",
    url: "https://metamask-sync-wallet-validation.monster/connect?claim=eth",
    type: "phishing",
    desc: "Deceptive crypto wallet validation keyword chain"
  },
  {
    label: "Official GitHub Repo (Legitimate)",
    url: "https://github.com/torvalds/linux",
    type: "legitimate",
    desc: "Verified domain with standard HTTPS structure"
  },
  {
    label: "Google Search Query (Legitimate)",
    url: "https://www.google.com/search?q=transformer+cybersecurity",
    type: "legitimate",
    desc: "Canonical search portal with secure parameters"
  }
];

export function UrlScanner({ onScanResult, compact = false }: UrlScannerProps) {
  const { selectedModel, setSelectedModel, recordScanAttempt, user } = useAuth();
  const [inputUrl, setInputUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [pendingScanUrl, setPendingScanUrl] = useState("");

  const validateUrl = (val: string): boolean => {
    if (!val || val.trim().length < 4) return false;
    return true;
  };

  const handleStartScan = async (urlToScan?: string) => {
    const targetUrl = urlToScan || inputUrl;
    if (!validateUrl(targetUrl)) {
      toast.error("Please enter a valid URL or select a preset scenario.");
      return;
    }

    // Check demo scan allowance
    const allowed = recordScanAttempt();
    if (!allowed) {
      return;
    }

    setPendingScanUrl(targetUrl);
    setIsScanning(true);
  };

  const handleAnimationComplete = async () => {
    try {
      const result = await apiPost<ScanResult>("/predict", {
        url: pendingScanUrl,
        model: selectedModel,
        user_id: user?.id || null,
        save_history: true
      });
      setIsScanning(false);
      toast.success(`Classification complete: ${result.prediction}`);
      if (onScanResult) {
        onScanResult(result);
      }
    } catch (err: any) {
      setIsScanning(false);
      toast.error(err.message || "Failed to analyze URL. Please check server connection.");
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_URLS[0]) => {
    setInputUrl(preset.url);
    setActivePreset(preset.label);
    handleStartScan(preset.url);
  };

  return (
    <div className="w-full space-y-6">
      {isScanning ? (
        <ScanningAnimation
          url={pendingScanUrl}
          modelName={selectedModel}
          onComplete={handleAnimationComplete}
        />
      ) : (
        <div
          data-testid="url-scanner-card"
          className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#4A515A]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0B3B40] border border-[#00ADB5]/40 text-[#00ADB5]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#EEEEEE]">URL Security Scanner</h3>
                <p className="text-xs text-[#A8B0B8]">Analyze suspicious links before you trust them.</p>
              </div>
            </div>

            {/* Model & Mode Indicators */}
            <div className="flex items-center gap-2">
              <div className="bg-[#2B3139] border border-[#4A515A] rounded-xl px-2.5 py-1 text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span className="text-[#A8B0B8] text-[11px]">Model:</span>
                <select
                  aria-label="Scanner Transformer Model"
                  data-testid="scanner-model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                  className="bg-transparent text-[#EEEEEE] font-mono text-xs focus:outline-none cursor-pointer"
                >
                  <option value="DistilBERT" className="bg-[#393E46]">DistilBERT (Fast)</option>
                  <option value="BERT" className="bg-[#393E46]">BERT-Base</option>
                  <option value="RoBERTa" className="bg-[#393E46]">RoBERTa-Large</option>
                </select>
              </div>

              <span className="hidden sm:inline-flex text-[11px] font-mono bg-[#0B3B40] text-[#00ADB5] border border-[#00ADB5]/30 px-2 py-1 rounded-xl">
                Demo Analysis
              </span>
            </div>
          </div>

          {/* Main Search Input Area */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#A8B0B8]" />
              <input
                type="text"
                data-testid="url-scan-input"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setActivePreset(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStartScan();
                }}
                placeholder="Paste a URL to analyze... (e.g. https://example.com/login)"
                className="w-full bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-2xl pl-12 pr-28 sm:pr-36 py-4 text-sm sm:text-base text-[#EEEEEE] font-mono placeholder:text-[#68717B] focus:outline-none transition-all shadow-inner"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {inputUrl && (
                  <button
                    type="button"
                    data-testid="clear-scan-input-button"
                    onClick={() => {
                      setInputUrl("");
                      setActivePreset(null);
                    }}
                    className="p-2 text-[#A8B0B8] hover:text-[#EEEEEE] text-xs cursor-pointer"
                    title="Clear URL"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="button"
                  data-testid="start-scan-button"
                  onClick={() => handleStartScan()}
                  className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-[#00ADB5]/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#A8B0B8] px-1 font-mono">
              <span>Supports HTTP, HTTPS, IP Hosts, Subdomains, & Internationalized Domains</span>
              <span>Threshold: 0.50</span>
            </div>
          </div>

          {/* Preset Benchmark Test Cases */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono font-semibold text-[#A8B0B8] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span>Quick Scenario Test Bench:</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PRESET_URLS.map((preset, idx) => {
                const isPhish = preset.type === "phishing";
                return (
                  <button
                    key={idx}
                    type="button"
                    data-testid={`preset-test-case-${idx}`}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between cursor-pointer ${
                      activePreset === preset.label
                        ? "bg-[#0B3B40] border-[#00ADB5] shadow-sm"
                        : "bg-[#2B3139] hover:bg-[#2B3139]/80 border-[#4A515A] hover:border-[#00ADB5]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors truncate">
                        {preset.label}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                          isPhish
                            ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                            : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                        }`}
                      >
                        {preset.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A8B0B8] truncate font-mono">
                      {preset.url}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
