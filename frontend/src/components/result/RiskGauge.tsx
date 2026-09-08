import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import type { RiskLevel, PredictionType } from "@/types";

interface RiskGaugeProps {
  score: number;
  confidence: number;
  riskLevel: RiskLevel;
  prediction: PredictionType;
  size?: "sm" | "md" | "lg";
}

export function RiskGauge({
  score,
  confidence,
  riskLevel,
  prediction,
  size = "md"
}: RiskGaugeProps) {
  const isPhishing = prediction === "PHISHING";
  const isLegitimate = prediction === "LEGITIMATE";

  // Radius & Geometry
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = isPhishing ? "#EF4444" : isLegitimate ? "#22C55E" : "#F59E0B";
  const bgGlow = isPhishing ? "rgba(239, 68, 68, 0.15)" : isLegitimate ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)";

  return (
    <div
      data-testid="risk-gauge-container"
      className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-xl"
    >
      <div
        className="absolute inset-0 pointer-events-none blur-2xl"
        style={{ backgroundColor: bgGlow }}
      />

      {/* SVG Circular Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-[#2B3139]"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Value stroke */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute flex flex-col items-center justify-center">
          <span
            data-testid="risk-gauge-score"
            className="text-4xl font-extrabold font-mono tracking-tight"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A8B0B8] mt-0.5">
            Risk Score / 100
          </span>
        </div>
      </div>

      {/* Prediction Badge */}
      <div className="mt-2 space-y-1.5">
        <div
          data-testid="security-verdict-badge"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${color}20`,
            color: color,
            border: `1px solid ${color}60`
          }}
        >
          {isPhishing && <ShieldAlert className="w-4 h-4" />}
          {isLegitimate && <ShieldCheck className="w-4 h-4" />}
          {!isPhishing && !isLegitimate && <AlertTriangle className="w-4 h-4" />}
          <span>{prediction} DETECTED</span>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#A8B0B8] pt-1">
          <div>
            Risk Level: <strong className="text-[#EEEEEE]">{riskLevel}</strong>
          </div>
          <div className="text-[#4A515A]">•</div>
          <div>
            Confidence:{" "}
            <strong className="text-[#00ADB5]">{(confidence * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
