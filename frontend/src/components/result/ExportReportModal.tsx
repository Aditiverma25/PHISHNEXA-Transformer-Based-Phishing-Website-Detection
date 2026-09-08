import { Download, FileText, Copy, Check, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ScanResult } from "@/types";

interface ExportReportModalProps {
  scan: ScanResult;
  open: boolean;
  onClose: () => void;
}

export function ExportReportModal({ scan, open, onClose }: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const generateReportText = () => {
    return `============================================================
PHISHNEXA CYBERSECURITY INTELLIGENCE REPORT
============================================================
Report Generated: ${new Date(scan.created_at || Date.now()).toUTCString()}
Scan ID: ${scan.id}
Model Engine: ${scan.model_name}
Analysis Mode: ${scan.is_demo_analysis ? "Demo Analysis" : "Live Production"}

VERDICT: ${scan.prediction}
RISK SCORE: ${scan.risk_score} / 100 (Level: ${scan.risk_level})
CONFIDENCE: ${(scan.confidence * 100).toFixed(1)}%
INFERENCE TIME: ${scan.inference_time_ms} ms

TARGET URL:
${scan.url}

URL STRUCTURAL ANATOMY:
- Protocol: ${scan.anatomy.protocol} (HTTPS: ${scan.anatomy.has_https ? "Yes" : "No"})
- Host: ${scan.anatomy.host}
- Domain: ${scan.anatomy.domain}
- Subdomain: ${scan.anatomy.subdomain || "(None)"}
- Path: ${scan.anatomy.path}
- Query Parameters: ${scan.anatomy.num_params}
- Entropy: ${scan.anatomy.entropy} bits
- Length: ${scan.anatomy.url_length} characters

DETECTED THREAT INDICATORS:
${scan.indicators.map((ind, i) => `${i + 1}. [${ind.severity}] ${ind.title} (+${ind.weight} pts)\n   ${ind.description}`).join("\n") || "No threat indicators detected."}

EXPLAINABLE AI ATTRIBUTION & COUNTERFACTUALS:
${scan.counterfactuals.map((cf) => `- ${cf.factor}: ${cf.explanation} (${cf.delta_risk}% risk delta)`).join("\n")}

RECOMMENDED ACTION:
${scan.prediction === "PHISHING" ? "DO NOT enter passwords, banking details, or credentials. Verify domain authority through verified channels." : "URL follows legitimate navigational structure. Standard browsing precautions apply."}

DISCLAIMER:
Detection results represent model predictions and should not be treated as an absolute guarantee of website safety.
============================================================`;
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishnexa-report-${scan.id.slice(0, 8)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("JSON Report downloaded successfully.");
  };

  const handleDownloadText = () => {
    const textStr = "data:text/plain;charset=utf-8," + encodeURIComponent(generateReportText());
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", textStr);
    downloadAnchor.setAttribute("download", `phishnexa-report-${scan.id.slice(0, 8)}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Text Intelligence Report downloaded successfully.");
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    toast.success("Report copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="export-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-2xl bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00ADB5]" />
            <h3 className="text-base font-bold text-[#EEEEEE]">Download Intelligence Report</h3>
          </div>
          <button onClick={onClose} className="text-[#A8B0B8] hover:text-[#EEEEEE] cursor-pointer">
            ✕
          </button>
        </div>

        {/* Report Preview Box */}
        <div className="bg-[#222831] border border-[#4A515A] rounded-xl p-4 max-h-72 overflow-y-auto font-mono text-xs text-[#EEEEEE] space-y-2 whitespace-pre-wrap leading-relaxed">
          {generateReportText()}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadJSON}
            data-testid="export-report-json-button"
            className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00ADB5]" />
            <span>Download JSON</span>
          </button>

          <button
            onClick={handleDownloadText}
            data-testid="export-report-txt-button"
            className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#00ADB5]" />
            <span>Download Text / PDF</span>
          </button>

          <button
            onClick={handleCopyClipboard}
            data-testid="export-report-copy-button"
            className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
