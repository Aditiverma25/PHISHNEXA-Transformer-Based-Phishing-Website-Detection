import { useState } from "react";
import { UrlScanner } from "@/components/scanner/UrlScanner";
import { FullResultView } from "@/components/result/FullResultView";
import { Shield, Sparkles, Cpu, Terminal } from "lucide-react";
import type { ScanResult } from "@/types";

export default function ScannerPage() {
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#0B3B40] text-[#00ADB5] border border-[#00ADB5]/40">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
              URL Security Scanner
            </h1>
            <p className="text-xs sm:text-sm text-[#A8B0B8]">
              Multi-stage contextual Transformer analysis for live web links & suspicious domains.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scanner or Result */}
      {activeScan ? (
        <FullResultView scan={activeScan} onResetScan={() => setActiveScan(null)} />
      ) : (
        <UrlScanner onScanResult={(res) => setActiveScan(res)} />
      )}
    </div>
  );
}
