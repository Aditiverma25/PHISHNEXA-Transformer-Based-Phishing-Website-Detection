import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiDelete } from "@/lib/api";
import { FullResultView } from "@/components/result/FullResultView";
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Download,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  FileCode
} from "lucide-react";
import { toast } from "sonner";
import type { ScanResult, PredictionType } from "@/types";

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const { data: scans, isLoading } = useQuery<ScanResult[]>({
    queryKey: ["scans-list", search, filterType, sortOrder],
    queryFn: () =>
      apiGet<ScanResult[]>(
        `/scans?search=${encodeURIComponent(search)}&prediction=${filterType}&sort=${sortOrder}&limit=100`
      )
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/scans/${id}`),
    onSuccess: () => {
      toast.success("Scan record deleted.");
      queryClient.invalidateQueries({ queryKey: ["scans-list"] });
      if (selectedScan) setSelectedScan(null);
    },
    onError: () => {
      toast.error("Failed to delete record.");
    }
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this scan telemetry record?")) {
      deleteMutation.mutate(id);
    }
  };

  const exportAllHistoryJSON = () => {
    if (!scans || scans.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishnexa-history-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Full scan history exported as JSON.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#4A515A]">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-[#00ADB5]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
              Scan History & Telemetry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
            Search, filter, and review historical URL classifications and user validation feedback.
          </p>
        </div>

        {scans && scans.length > 0 && (
          <button
            onClick={exportAllHistoryJSON}
            data-testid="export-all-history-button"
            className="bg-[#2B3139] hover:bg-[#4A515A] border border-[#4A515A] text-[#EEEEEE] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00ADB5]" />
            <span>Export History JSON</span>
          </button>
        )}
      </div>

      {/* Selected Scan Detail Modal / View */}
      {selectedScan && (
        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase text-[#00ADB5] font-bold">
              Inspecting Historical Scan:
            </h2>
            <button
              onClick={() => setSelectedScan(null)}
              data-testid="close-history-inspect"
              className="text-xs bg-[#2B3139] hover:bg-[#4A515A] text-[#EEEEEE] px-3 py-1.5 rounded-xl border border-[#4A515A] cursor-pointer"
            >
              Back to History List
            </button>
          </div>
          <FullResultView scan={selectedScan} onResetScan={() => setSelectedScan(null)} />
        </div>
      )}

      {/* Filter and Search Bar */}
      {!selectedScan && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B0B8]" />
              <input
                type="text"
                data-testid="history-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by URL or domain..."
                className="w-full bg-[#2B3139] border border-[#4A515A] focus:border-[#00ADB5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#EEEEEE] font-mono focus:outline-none"
              />
            </div>

            {/* Classification Filter */}
            <div className="flex items-center gap-2 bg-[#2B3139] border border-[#4A515A] rounded-xl px-3 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#00ADB5]" />
              <span className="text-[#A8B0B8]">Classification:</span>
              <select
                data-testid="history-filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-[#EEEEEE] font-mono text-xs focus:outline-none cursor-pointer flex-1"
              >
                <option value="ALL" className="bg-[#393E46]">All Verdicts</option>
                <option value="PHISHING" className="bg-[#393E46]">Phishing Only</option>
                <option value="LEGITIMATE" className="bg-[#393E46]">Legitimate Only</option>
                <option value="SUSPICIOUS" className="bg-[#393E46]">Suspicious Only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2 bg-[#2B3139] border border-[#4A515A] rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#00ADB5]" />
              <span className="text-[#A8B0B8]">Sort By:</span>
              <select
                data-testid="history-sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent text-[#EEEEEE] font-mono text-xs focus:outline-none cursor-pointer flex-1"
              >
                <option value="newest" className="bg-[#393E46]">Newest First</option>
                <option value="oldest" className="bg-[#393E46]">Oldest First</option>
                <option value="highest_risk" className="bg-[#393E46]">Highest Risk Score</option>
                <option value="lowest_risk" className="bg-[#393E46]">Lowest Risk Score</option>
              </select>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-[#A8B0B8]">
                Loading historical telemetry...
              </div>
            ) : scans && scans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#4A515A] text-[#A8B0B8] text-[11px] uppercase">
                      <th className="py-2.5 px-3">Target URL</th>
                      <th className="py-2.5 px-3">Verdict</th>
                      <th className="py-2.5 px-3">Risk Score</th>
                      <th className="py-2.5 px-3">Confidence</th>
                      <th className="py-2.5 px-3">Model</th>
                      <th className="py-2.5 px-3">Feedback</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A515A]/40">
                    {scans.map((scan) => {
                      const isPhish = scan.prediction === "PHISHING";
                      const isLegit = scan.prediction === "LEGITIMATE";
                      const color = isPhish ? "#EF4444" : isLegit ? "#22C55E" : "#F59E0B";

                      return (
                        <tr
                          key={scan.id}
                          data-testid={`history-row-${scan.id}`}
                          onClick={() => setSelectedScan(scan)}
                          className="hover:bg-[#2B3139] cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-3 max-w-[260px] truncate text-[#EEEEEE] font-semibold">
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
                          <td className="py-3 px-3">
                            {scan.feedback ? (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  scan.feedback === "correct"
                                    ? "bg-[#22C55E]/15 text-[#22C55E]"
                                    : "bg-[#EF4444]/15 text-[#EF4444]"
                                }`}
                              >
                                {scan.feedback}
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#A8B0B8]">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => handleDelete(scan.id, e)}
                              data-testid={`delete-scan-btn-${scan.id}`}
                              className="p-1.5 text-[#A8B0B8] hover:text-[#EF4444] rounded hover:bg-[#2B3139] cursor-pointer"
                              title="Delete Scan Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-[#A8B0B8] space-y-2">
                <AlertTriangle className="w-8 h-8 text-[#F59E0B] mx-auto" />
                <div className="font-bold text-[#EEEEEE]">No Scans Found</div>
                <div>Try modifying your search criteria or running a new scan.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
