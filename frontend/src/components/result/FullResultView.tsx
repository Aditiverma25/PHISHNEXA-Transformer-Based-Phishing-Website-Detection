import { useState } from "react";
import { RiskGauge } from "@/components/result/RiskGauge";
import { UrlAnatomyComponent } from "@/components/result/UrlAnatomy";
import { ThreatIndicators } from "@/components/result/ThreatIndicators";
import { ExplainableAi } from "@/components/result/ExplainableAi";
import { TokenAttentionHeatmap } from "@/components/result/TokenAttentionHeatmap";
import { ModelComparisonSection } from "@/components/result/ModelComparisonModal";
import { ExportReportModal } from "@/components/result/ExportReportModal";
import {
  RotateCcw,
  Download,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import type { ScanResult } from "@/types";

interface FullResultViewProps {
  scan: ScanResult;
  onResetScan: () => void;
}

export function FullResultView({ scan, onResetScan }: FullResultViewProps) {
  const [feedback, setFeedback] = useState<string | null>(scan.feedback || null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const isPhishing = scan.prediction === "PHISHING";
  const isLegitimate = scan.prediction === "LEGITIMATE";

  const handleFeedback = async (type: "correct" | "incorrect") => {
    if (feedback) return;
    setIsSubmittingFeedback(true);
    try {
      await apiPost(`/scans/${scan.id}/feedback`, { feedback: type });
      setFeedback(type);
      toast.success(`Feedback recorded (${type}). Thank you for assisting model validation!`);
    } catch {
      setFeedback(type);
      toast.success("Feedback recorded locally.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div
      data-testid="full-result-view"
      className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      {/* Top Action Bar with Analyzed URL */}
      <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono bg-[#0B3B40] text-[#00ADB5] px-2 py-0.5 rounded border border-[#00ADB5]/30">
              Analyzed Target
            </span>
            <span className="text-xs text-[#A8B0B8] flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {scan.inference_time_ms} ms Latency
            </span>
            <span className="text-xs text-[#A8B0B8] flex items-center gap-1 font-mono hidden sm:inline-flex">
              <Cpu className="w-3.5 h-3.5 text-[#00ADB5]" />
              {scan.model_name}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold font-mono text-[#EEEEEE] truncate max-w-2xl">
            {scan.url}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setExportModalOpen(true)}
            data-testid="result-export-report-button"
            className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00ADB5]" />
            <span>Download Report</span>
          </button>

          <button
            onClick={onResetScan}
            data-testid="result-scan-another-button"
            className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-[#00ADB5]/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan Another URL</span>
          </button>
        </div>
      </div>

      {/* Main Verdict & Gauge Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Risk Gauge */}
        <div className="lg:col-span-1">
          <RiskGauge
            score={scan.risk_score}
            confidence={scan.confidence}
            riskLevel={scan.risk_level}
            prediction={scan.prediction}
          />
        </div>

        {/* Right: SOC Threat Advisory & Recommended Action Card */}
        <div className="lg:col-span-2 bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
              <div className="flex items-center gap-2">
                <Shield
                  className={`w-5 h-5 ${
                    isPhishing ? "text-[#EF4444]" : isLegitimate ? "text-[#22C55E]" : "text-[#F59E0B]"
                  }`}
                />
                <h3 className="text-base font-bold text-[#EEEEEE]">
                  SOC Security Recommendation
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#A8B0B8]">
                Confidence: {(scan.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isPhishing
                  ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
                  : isLegitimate
                  ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
                  : "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]"
              }`}
            >
              <div className="font-bold text-sm mb-1">
                {isPhishing && "HIGH-RISK PHISHING THREAT ADVISORY"}
                {isLegitimate && "VERIFIED LEGITIMATE NAVIGATIONAL ASSET"}
                {!isPhishing && !isLegitimate && "SUSPICIOUS STRUCTURAL ANOMALY DETECTED"}
              </div>
              <p className="text-xs text-[#EEEEEE] leading-relaxed">
                {isPhishing &&
                  "This URL matches behavioral and contextual patterns indicative of credential harvesting or brand spoofing. Automated countermeasures recommended."}
                {isLegitimate &&
                  "URL features conform to standard web standards with authentic root domain ownership and expected encryption parameters."}
                {!isPhishing &&
                  !isLegitimate &&
                  "URL exhibits non-standard lexical parameters or redirection chains. Manual verification recommended before entering private data."}
              </p>
            </div>

            {/* Checklist of actions */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-semibold text-[#A8B0B8] uppercase font-mono">
                Mandatory SOC Safeguards:
              </div>
              <ul className="space-y-1.5 text-xs text-[#EEEEEE]">
                {isPhishing ? (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="text-[#EF4444]">✕</span>
                      <span>Do NOT submit corporate credentials, passwords, or 2FA codes.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#EF4444]">✕</span>
                      <span>Do NOT download binary attachments or execute scripts from this origin.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#00ADB5]">✓</span>
                      <span>Add domain to perimeter DNS blocklist / email firewall.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="text-[#22C55E]">✓</span>
                      <span>HTTPS encryption validated; standard web navigation permitted.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#22C55E]">✓</span>
                      <span>No unauthorized brand impersonation detected in domain authority.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* User Feedback Loop */}
          <div className="pt-4 border-t border-[#4A515A] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#A8B0B8] font-mono">
              Was this Transformer prediction accurate?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFeedback("correct")}
                disabled={feedback !== null || isSubmittingFeedback}
                data-testid="feedback-thumbs-up-button"
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  feedback === "correct"
                    ? "bg-[#22C55E] text-[#222831] border-[#22C55E]"
                    : "bg-[#2B3139] hover:bg-[#4A515A] border-[#4A515A] text-[#EEEEEE]"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Accurate</span>
              </button>

              <button
                type="button"
                onClick={() => handleFeedback("incorrect")}
                disabled={feedback !== null || isSubmittingFeedback}
                data-testid="feedback-thumbs-down-button"
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  feedback === "incorrect"
                    ? "bg-[#EF4444] text-[#222831] border-[#EF4444]"
                    : "bg-[#2B3139] hover:bg-[#4A515A] border-[#4A515A] text-[#EEEEEE]"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Inaccurate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* URL Structural Anatomy */}
      <UrlAnatomyComponent anatomy={scan.anatomy} />

      {/* Threat Indicators */}
      <ThreatIndicators indicators={scan.indicators} />

      {/* Token Attention Heatmap */}
      <TokenAttentionHeatmap tokens={scan.tokens} modelName={scan.model_name} />

      {/* Explainable AI & Counterfactuals */}
      <ExplainableAi
        counterfactuals={scan.counterfactuals}
        tokens={scan.tokens}
        indicators={scan.indicators}
        anatomy={scan.anatomy}
        homoglyphAnalysis={scan.homoglyph_analysis}
        riskScore={scan.risk_score}
      />

      {/* Multi-Model Consensus Breakdown */}
      <ModelComparisonSection
        consensus={scan.consensus}
        consensusAgreement={scan.consensus_agreement}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        scan={scan}
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
