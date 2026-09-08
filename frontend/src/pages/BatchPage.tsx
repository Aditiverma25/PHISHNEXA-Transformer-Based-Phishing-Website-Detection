import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Layers,
  Upload,
  Play,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { BatchScanResponse, BatchItemResult, ModelType } from "@/types";

const SAMPLE_BATCH_CSV = `https://paypa1-account-security-verification.com/login/auth?session=expired
https://login.microsoftonline.com-auth-verify.xyz/login.php?ref=mail
http://192.168.1.104/bankofamerica-online-banking/update.html
https://github.com/torvalds/linux
https://www.google.com/search?q=transformer+cybersecurity
https://developer.mozilla.org/en-US/docs/Web/HTTP
https://metamask-sync-wallet-validation.monster/connect?claim=eth
https://appleid.apple.com-verify-account-device.info/security
https://stripe.com/docs/api`;

export default function BatchPage() {
  const { selectedModel } = useAuth();
  const [inputText, setInputText] = useState(SAMPLE_BATCH_CSV);
  const [model, setModel] = useState<ModelType>(selectedModel);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchScanResponse | null>(null);

  const handleStartBatch = async () => {
    const urls = inputText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 3);

    if (urls.length === 0) {
      toast.error("Please enter at least one valid URL to analyze.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiPost<BatchScanResponse>("/batch/scan", {
        urls,
        model
      });
      setBatchResult(response);
      toast.success(`Batch analysis completed: ${response.total_processed} URLs processed.`);
    } catch (err: any) {
      toast.error(err.message || "Batch scan execution failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      toast.success(`Loaded file with ${content.split("\n").filter(Boolean).length} lines.`);
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    if (!batchResult) return;
    const header = "URL,Prediction,Risk Score,Confidence,Risk Level,Indicators Count,Inference Time (ms)\n";
    const rows = batchResult.results
      .map(
        (r) =>
          `"${r.url}","${r.prediction}",${r.risk_score},${(r.confidence * 100).toFixed(1)}%,"${r.risk_level}",${r.indicators_count},${r.inference_time_ms}`
      )
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + rows);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `phishnexa-batch-results-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Batch CSV results downloaded.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4A515A]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00ADB5]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
              Batch CSV URL Scanner
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
            High-throughput contextual Transformer evaluation for threat feeds, CSV logs, & corporate email queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-[#0B3B40] text-[#00ADB5] border border-[#00ADB5]/30 px-3 py-1 rounded-xl">
            Max 50 URLs / Batch
          </span>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#4A515A]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00ADB5]" />
            <span className="text-xs font-bold text-[#EEEEEE] font-mono">
              URL List or CSV File Input (1 URL per line)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* File upload input */}
            <label className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#00ADB5]" />
              <span>Import .CSV / .TXT</span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="batch-file-upload-input"
              />
            </label>

            {/* Model select */}
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as ModelType)}
              data-testid="batch-model-select"
              className="bg-[#2B3139] border border-[#4A515A] text-[#EEEEEE] text-xs font-mono px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="DistilBERT">DistilBERT (Fastest)</option>
              <option value="BERT">BERT-Base</option>
              <option value="RoBERTa">RoBERTa-Large</option>
            </select>
          </div>
        </div>

        <textarea
          rows={7}
          data-testid="batch-url-textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="https://example1.com&#10;https://example2.com/login"
          className="w-full bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-xl p-3 text-xs font-mono text-[#EEEEEE] focus:outline-none placeholder:text-[#68717B]"
        />

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setInputText(SAMPLE_BATCH_CSV)}
            className="text-xs text-[#00ADB5] hover:underline font-mono cursor-pointer"
          >
            Load Sample Phishing & Benign URLs
          </button>

          <button
            onClick={handleStartBatch}
            disabled={isProcessing}
            data-testid="start-batch-scan-button"
            className="bg-[#00ADB5] hover:bg-[#19C3CC] text-[#222831] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md hover:shadow-[#00ADB5]/20 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#222831] border-t-transparent rounded-full animate-spin" />
                <span>Running Transformer Batch...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute Batch Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {batchResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#393E46] border border-[#4A515A] rounded-xl p-4 text-center">
              <div className="text-xs text-[#A8B0B8]">Total Analyzed</div>
              <div className="text-2xl font-bold font-mono text-[#EEEEEE] mt-1">
                {batchResult.total_processed}
              </div>
            </div>
            <div className="bg-[#393E46] border border-[#EF4444]/40 rounded-xl p-4 text-center bg-[#EF4444]/5">
              <div className="text-xs text-[#EF4444]">Phishing Flags</div>
              <div className="text-2xl font-bold font-mono text-[#EF4444] mt-1">
                {batchResult.phishing_count}
              </div>
            </div>
            <div className="bg-[#393E46] border border-[#22C55E]/40 rounded-xl p-4 text-center bg-[#22C55E]/5">
              <div className="text-xs text-[#22C55E]">Legitimate Verified</div>
              <div className="text-2xl font-bold font-mono text-[#22C55E] mt-1">
                {batchResult.legitimate_count}
              </div>
            </div>
            <div className="bg-[#393E46] border border-[#00ADB5]/40 rounded-xl p-4 text-center">
              <div className="text-xs text-[#A8B0B8]">Avg Latency / URL</div>
              <div className="text-2xl font-bold font-mono text-[#00ADB5] mt-1">
                {batchResult.avg_inference_ms} ms
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
              <h3 className="text-base font-bold text-[#EEEEEE]">
                Batch Classification Results ({batchResult.results.length})
              </h3>
              <button
                onClick={handleExportCSV}
                data-testid="batch-export-csv-button"
                className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span>Export Results (.CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#4A515A] text-[#A8B0B8] text-[11px] uppercase">
                    <th className="py-2.5 px-3">URL</th>
                    <th className="py-2.5 px-3">Verdict</th>
                    <th className="py-2.5 px-3">Risk Score</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Threat Indicators</th>
                    <th className="py-2.5 px-3 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4A515A]/40">
                  {batchResult.results.map((res, idx) => {
                    const isPhish = res.prediction === "PHISHING";
                    const isLegit = res.prediction === "LEGITIMATE";
                    const color = isPhish ? "#EF4444" : isLegit ? "#22C55E" : "#F59E0B";

                    return (
                      <tr
                        key={idx}
                        data-testid={`batch-result-row-${idx}`}
                        className="hover:bg-[#2B3139]/60"
                      >
                        <td className="py-3 px-3 max-w-[320px] truncate text-[#EEEEEE] font-semibold">
                          {res.url}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className="px-2 py-0.5 rounded font-bold uppercase text-[10px]"
                            style={{
                              backgroundColor: `${color}15`,
                              color: color,
                              border: `1px solid ${color}40`
                            }}
                          >
                            {res.prediction}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold" style={{ color }}>
                          {res.risk_score} / 100
                        </td>
                        <td className="py-3 px-3 text-[#A8B0B8]">
                          {(res.confidence * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-[#A8B0B8]">
                          {res.indicators_count} item(s)
                        </td>
                        <td className="py-3 px-3 text-right text-[#A8B0B8]">
                          {res.inference_time_ms} ms
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
