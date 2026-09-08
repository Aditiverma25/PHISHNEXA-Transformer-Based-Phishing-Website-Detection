import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { UrlScanner } from "@/components/scanner/UrlScanner";
import { FullResultView } from "@/components/result/FullResultView";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Sparkles,
  Layers,
  Cpu,
  BarChart2,
  Clock,
  ChevronRight,
  TrendingUp,
  FlaskConical,
  Scale
} from "lucide-react";
import type { ScansSummary, ScanResult } from "@/types";

export default function Dashboard() {
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);

  const { data: summary, isLoading } = useQuery<ScansSummary>({
    queryKey: ["scans-summary"],
    queryFn: () => apiGet<ScansSummary>("/scans/stats/summary")
  });

  const totalScans = summary?.total_scans ?? 1284;
  const phishingDetected = summary?.phishing_detected ?? 317;
  const legitimateUrls = summary?.legitimate_urls ?? 967;
  const avgConfidence = summary?.avg_confidence ?? 94.6;
  const recentScans = summary?.recent_scans ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4A515A]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
              Security Intelligence
            </h1>
            <span className="text-[11px] font-mono bg-[#0B3B40] text-[#00ADB5] border border-[#00ADB5]/30 px-2 py-0.5 rounded-md">
              SOC Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
            Monitor URL analysis and model performance in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/batch"
            data-testid="dashboard-batch-scan-button"
            className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span>Batch Scanner</span>
          </Link>
          <Link
            to="/compare"
            data-testid="dashboard-compare-button"
            className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span>Compare URLs</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          data-testid="kpi-total-scans"
          className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A8B0B8]">
            <span>Total Scans</span>
            <Activity className="w-4 h-4 text-[#00ADB5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#EEEEEE]">
            {totalScans.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#A8B0B8] pt-1">
            <span className="text-[#22C55E] flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" /> +14.2% today
            </span>
            <span className="font-mono text-[10px] text-[#00ADB5]">Demo Data</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          data-testid="kpi-phishing-detected"
          className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A8B0B8]">
            <span>Phishing Detected</span>
            <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#EF4444]">
            {phishingDetected.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#A8B0B8] pt-1">
            <span>24.7% Threat Ratio</span>
            <span className="font-mono text-[10px] text-[#00ADB5]">Demo Data</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          data-testid="kpi-legitimate-urls"
          className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A8B0B8]">
            <span>Legitimate URLs</span>
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#22C55E]">
            {legitimateUrls.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#A8B0B8] pt-1">
            <span>75.3% Verified Benign</span>
            <span className="font-mono text-[10px] text-[#00ADB5]">Demo Data</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          data-testid="kpi-avg-confidence"
          className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-5 shadow-lg space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs text-[#A8B0B8]">
            <span>Average Confidence</span>
            <Cpu className="w-4 h-4 text-[#00ADB5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#00ADB5]">
            {avgConfidence}%
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#A8B0B8] pt-1">
            <span>DistilBERT / BERT Ensemble</span>
            <span className="font-mono text-[10px] text-[#00ADB5]">Demo Data</span>
          </div>
        </div>
      </div>

      {/* Main Scanner Bento Area */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#EEEEEE] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00ADB5]" />
          <span>Quick URL Scanner</span>
        </h2>

        {activeScan ? (
          <FullResultView scan={activeScan} onResetScan={() => setActiveScan(null)} />
        ) : (
          <UrlScanner onScanResult={(res) => setActiveScan(res)} />
        )}
      </div>

      {/* Recent Scans Table */}
      <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
          <div>
            <h3 className="text-base font-bold text-[#EEEEEE]">Recent URL Scans</h3>
            <p className="text-xs text-[#A8B0B8]">Latest telemetry processed across enterprise perimeter.</p>
          </div>
          <Link
            to="/history"
            data-testid="dashboard-view-all-history"
            className="text-xs font-semibold text-[#00ADB5] hover:underline flex items-center gap-1 font-mono"
          >
            <span>View Full History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table on desktop, cards on mobile */}
        {recentScans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#4A515A] text-[#A8B0B8] text-[11px] uppercase">
                  <th className="py-2.5 px-3">Analyzed URL</th>
                  <th className="py-2.5 px-3">Verdict</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A515A]/40">
                {recentScans.map((scan) => {
                  const isPhish = scan.prediction === "PHISHING";
                  const isLegit = scan.prediction === "LEGITIMATE";
                  const color = isPhish ? "#EF4444" : isLegit ? "#22C55E" : "#F59E0B";

                  return (
                    <tr
                      key={scan.id}
                      data-testid={`recent-scan-row-${scan.id}`}
                      className="hover:bg-[#2B3139]/60 transition-colors"
                    >
                      <td className="py-3 px-3 max-w-[280px] truncate text-[#EEEEEE] font-semibold">
                        {scan.url}
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
                          {scan.prediction}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold" style={{ color }}>
                        {scan.risk_score} / 100
                      </td>
                      <td className="py-3 px-3 text-[#A8B0B8]">
                        {(scan.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 text-[#A8B0B8]">
                        {scan.model_name}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setActiveScan(scan)}
                          data-testid={`inspect-scan-btn-${scan.id}`}
                          className="text-xs bg-[#2B3139] hover:bg-[#00ADB5] hover:text-[#222831] text-[#EEEEEE] px-2.5 py-1 rounded-lg border border-[#4A515A] transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#A8B0B8] space-y-1">
            <Clock className="w-6 h-6 mx-auto text-[#4A515A]" />
            <div>No scan history available yet. Run a scan above to populate telemetry.</div>
          </div>
        )}
      </div>
    </div>
  );
}
