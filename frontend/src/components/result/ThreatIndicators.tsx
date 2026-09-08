import { AlertOctagon, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import type { ThreatIndicatorItem } from "@/types";

interface ThreatIndicatorsProps {
  indicators: ThreatIndicatorItem[];
}

export function ThreatIndicators({ indicators }: ThreatIndicatorsProps) {
  if (!indicators || indicators.length === 0) {
    return (
      <div
        data-testid="threat-indicators-empty"
        className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 text-center space-y-2"
      >
        <CheckCircle className="w-8 h-8 text-[#22C55E] mx-auto" />
        <h4 className="text-sm font-bold text-[#EEEEEE]">Zero Threat Indicators Detected</h4>
        <p className="text-xs text-[#A8B0B8]">
          This URL matches standard verified navigational signatures with no known phishing heuristics.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="threat-indicators-list"
      className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
          <h3 className="text-base font-bold text-[#EEEEEE]">
            Detected Threat Indicators ({indicators.length})
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#A8B0B8]">
          Ranked by Risk Weight
        </span>
      </div>

      <div className="space-y-3">
        {indicators.map((ind, idx) => {
          const isHigh = ind.severity === "HIGH";
          const isMed = ind.severity === "MEDIUM";
          const colorCls = isHigh
            ? "border-[#EF4444]/40 bg-[#EF4444]/5 text-[#EF4444]"
            : isMed
            ? "border-[#F59E0B]/40 bg-[#F59E0B]/5 text-[#F59E0B]"
            : "border-[#22C55E]/40 bg-[#22C55E]/5 text-[#22C55E]";

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${colorCls} space-y-2 transition-all`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isHigh ? (
                    <AlertOctagon className="w-4 h-4 text-[#EF4444] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  )}
                  <span className="text-xs font-bold text-[#EEEEEE] font-mono">
                    {ind.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#2B3139] border border-[#4A515A] text-[#EEEEEE]">
                    Severity: {ind.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#2B3139] border border-[#4A515A] text-[#00ADB5]">
                    +{ind.weight} Risk Pts
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#A8B0B8] leading-relaxed">
                {ind.description}
              </p>

              <div className="text-[11px] bg-[#2B3139] p-2 rounded-lg border border-[#4A515A] text-[#EEEEEE] flex items-start gap-1.5 font-sans">
                <strong className="text-[#00ADB5] shrink-0 font-mono">SOC Action:</strong>
                <span>{ind.recommendation}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
