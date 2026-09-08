import { Cpu, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import type { ModelConsensusItem } from "@/types";

interface ModelComparisonModalProps {
  consensus: Record<string, ModelConsensusItem>;
  consensusAgreement: number;
}

export function ModelComparisonSection({ consensus, consensusAgreement }: ModelComparisonModalProps) {
  const models = [
    { key: "distilbert", name: "DistilBERT (Fast)", layers: "6 Layers", latency: "18ms" },
    { key: "bert", name: "BERT-Base-Uncased", layers: "12 Layers", latency: "45ms" },
    { key: "roberta", name: "RoBERTa-Large", layers: "24 Layers", latency: "62ms" }
  ];

  return (
    <div
      data-testid="model-comparison-card"
      className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#00ADB5]" />
          <div>
            <h3 className="text-base font-bold text-[#EEEEEE]">Multi-Model Consensus & Disagreement</h3>
            <p className="text-xs text-[#A8B0B8]">Tri-model ensemble validation across Transformer architectures.</p>
          </div>
        </div>
        <div className="bg-[#0B3B40] text-[#00ADB5] border border-[#00ADB5]/30 px-3 py-1 rounded-xl text-xs font-mono font-bold">
          Agreement: {consensusAgreement}%
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {models.map((m) => {
          const data = consensus[m.key];
          if (!data) return null;

          const isPhish = data.prediction === "PHISHING";
          const isLegit = data.prediction === "LEGITIMATE";
          const color = isPhish ? "#EF4444" : isLegit ? "#22C55E" : "#F59E0B";

          return (
            <div
              key={m.key}
              className="bg-[#2B3139] border border-[#4A515A] rounded-xl p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-[#EEEEEE]">{m.name}</div>
                <span className="text-[10px] font-mono text-[#A8B0B8]">{m.latency}</span>
              </div>

              <div
                className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5"
                style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}
              >
                {isPhish && <ShieldAlert className="w-3.5 h-3.5" />}
                {isLegit && <CheckCircle2 className="w-3.5 h-3.5" />}
                {!isPhish && !isLegit && <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{data.prediction}</span>
              </div>

              <div className="space-y-1 text-xs font-mono pt-1">
                <div className="flex justify-between text-[#A8B0B8]">
                  <span>Confidence:</span>
                  <span className="text-[#EEEEEE]">{(data.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-[#A8B0B8]">
                  <span>Risk Score:</span>
                  <span className="text-[#00ADB5]">{data.risk_score}/100</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
