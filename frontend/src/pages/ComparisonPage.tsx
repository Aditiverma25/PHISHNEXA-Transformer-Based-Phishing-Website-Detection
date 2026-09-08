import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Scale,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import type { ScanResult } from "@/types";

export default function ComparisonPage() {
  const { selectedModel } = useAuth();
  const [urlA, setUrlA] = useState("https://paypal.com/signin");
  const [urlB, setUrlB] = useState("https://paypa1-account-security-verification.com/login/auth?session=expired");
  const [loading, setLoading] = useState(false);
  const [resultA, setResultA] = useState<ScanResult | null>(null);
  const [resultB, setResultB] = useState<ScanResult | null>(null);

  const handleCompare = async () => {
    if (!urlA || !urlB) {
      toast.error("Please provide both URLs to run comparative analysis.");
      return;
    }
    setLoading(true);
    try {
      const [resA, resB] = await Promise.all([
        apiPost<ScanResult>("/predict", { url: urlA, model: selectedModel, save_history: false }),
        apiPost<ScanResult>("/predict", { url: urlB, model: selectedModel, save_history: false })
      ]);
      setResultA(resA);
      setResultB(resB);
      toast.success("Comparative analysis completed.");
    } catch (err: any) {
      toast.error(err.message || "Failed to compare URLs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#00ADB5]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
            Side-by-Side URL Comparative Analysis
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
          Inspect structural deltas, token attention variance, and risk score differences between deceptive and legitimate counterparts.
        </p>
      </div>

      {/* Dual Inputs Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* URL A Input */}
        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#00ADB5]">URL Asset A (Baseline Target)</span>
          </div>
          <input
            type="text"
            value={urlA}
            onChange={(e) => setUrlA(e.target.value)}
            data-testid="compare-input-url-a"
            placeholder="https://paypal.com/signin"
            className="w-full bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-xl px-3.5 py-2.5 text-xs text-[#EEEEEE] font-mono focus:outline-none"
          />
        </div>

        {/* URL B Input */}
        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#EF4444]">URL Asset B (Suspect Counterpart)</span>
          </div>
          <input
            type="text"
            value={urlB}
            onChange={(e) => setUrlB(e.target.value)}
            data-testid="compare-input-url-b"
            placeholder="https://paypa1-security-update.com/login"
            className="w-full bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-xl px-3.5 py-2.5 text-xs text-[#EEEEEE] font-mono focus:outline-none"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={loading}
          data-testid="execute-comparison-button"
          className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-8 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-[#00ADB5]/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-[#222831] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Scale className="w-4 h-4" />
          )}
          <span>Execute Comparative Differential Analysis</span>
        </button>
      </div>

      {/* Comparison Results */}
      {resultA && resultB && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Verdicts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card A */}
            <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
                <div className="font-mono text-xs font-bold text-[#00ADB5]">ASSET A</div>
                <div
                  className={`text-xs font-mono px-2.5 py-1 rounded-xl font-bold uppercase ${
                    resultA.prediction === "PHISHING"
                      ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                      : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                  }`}
                >
                  {resultA.prediction}
                </div>
              </div>

              <div className="text-xs font-mono text-[#EEEEEE] truncate font-bold">
                {resultA.url}
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs text-center">
                <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A]">
                  <div className="text-[#A8B0B8] text-[10px]">Risk Score</div>
                  <div className="text-xl font-bold text-[#EEEEEE] mt-1">{resultA.risk_score} / 100</div>
                </div>
                <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A]">
                  <div className="text-[#A8B0B8] text-[10px]">Confidence</div>
                  <div className="text-xl font-bold text-[#00ADB5] mt-1">{(resultA.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Anatomy Summary */}
              <div className="bg-[#2B3139] p-3 rounded-xl space-y-1.5 text-xs font-mono text-[#A8B0B8]">
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <span className="text-[#EEEEEE]">{resultA.anatomy.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entropy:</span>
                  <span className="text-[#EEEEEE]">{resultA.anatomy.entropy} bits</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="text-[#EEEEEE]">{resultA.anatomy.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Threat Indicators:</span>
                  <span className="text-[#00ADB5]">{resultA.indicators.length}</span>
                </div>
              </div>
            </div>

            {/* Card B */}
            <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
                <div className="font-mono text-xs font-bold text-[#EF4444]">ASSET B</div>
                <div
                  className={`text-xs font-mono px-2.5 py-1 rounded-xl font-bold uppercase ${
                    resultB.prediction === "PHISHING"
                      ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                      : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                  }`}
                >
                  {resultB.prediction}
                </div>
              </div>

              <div className="text-xs font-mono text-[#EEEEEE] truncate font-bold">
                {resultB.url}
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs text-center">
                <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A]">
                  <div className="text-[#A8B0B8] text-[10px]">Risk Score</div>
                  <div className="text-xl font-bold text-[#EF4444] mt-1">{resultB.risk_score} / 100</div>
                </div>
                <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A]">
                  <div className="text-[#A8B0B8] text-[10px]">Confidence</div>
                  <div className="text-xl font-bold text-[#00ADB5] mt-1">{(resultB.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Anatomy Summary */}
              <div className="bg-[#2B3139] p-3 rounded-xl space-y-1.5 text-xs font-mono text-[#A8B0B8]">
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <span className="text-[#EEEEEE]">{resultB.anatomy.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entropy:</span>
                  <span className="text-[#EEEEEE]">{resultB.anatomy.entropy} bits</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="text-[#EEEEEE]">{resultB.anatomy.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span>Threat Indicators:</span>
                  <span className="text-[#EF4444]">{resultB.indicators.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Differential Analysis Insight */}
          <div className="bg-[#2B3139] border border-[#00ADB5]/40 rounded-2xl p-6 shadow-xl space-y-3 font-mono text-xs">
            <h3 className="font-bold text-[#EEEEEE] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00ADB5]" />
              <span>Comparative Threat Summary & Delta:</span>
            </h3>
            <div className="text-[#A8B0B8] leading-relaxed">
              Risk score delta is <strong className="text-[#00ADB5]">{Math.abs(resultB.risk_score - resultA.risk_score)} points</strong>.
              {resultB.risk_score > resultA.risk_score
                ? " Asset B introduces anomalous token sequences, high character entropy, and potential typosquatting mimicking trusted brand authorities."
                : " Both assets show similar risk profiles."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
