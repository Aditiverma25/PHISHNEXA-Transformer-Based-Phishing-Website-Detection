import { useState } from "react";
import { Cpu, Terminal, Info } from "lucide-react";
import type { TokenAttentionItem } from "@/types";

interface TokenAttentionHeatmapProps {
  tokens: TokenAttentionItem[];
  modelName: string;
}

export function TokenAttentionHeatmap({ tokens, modelName }: TokenAttentionHeatmapProps) {
  const [activeToken, setActiveToken] = useState<TokenAttentionItem | null>(null);

  const getAttentionColor = (weight: number, isSuspicious: boolean) => {
    if (isSuspicious || weight >= 0.80) {
      return {
        bg: "bg-[#EF4444]/25 hover:bg-[#EF4444]/40",
        border: "border-[#EF4444]/60",
        text: "text-[#EF4444]"
      };
    }
    if (weight >= 0.50) {
      return {
        bg: "bg-[#00ADB5]/25 hover:bg-[#00ADB5]/40",
        border: "border-[#00ADB5]/60",
        text: "text-[#00ADB5]"
      };
    }
    return {
      bg: "bg-[#2B3139] hover:bg-[#393E46]",
      border: "border-[#4A515A]",
      text: "text-[#EEEEEE]"
    };
  };

  return (
    <div
      data-testid="token-attention-card"
      className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 shadow-xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#00ADB5]" />
          <div>
            <h3 className="text-base font-bold text-[#EEEEEE]">
              Contextual URL Representation & Attention Weights
            </h3>
            <p className="text-xs text-[#A8B0B8]">
              Hover tokens to inspect Transformer self-attention weights for {modelName}.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono bg-[#2B3139] text-[#A8B0B8] px-2.5 py-1 rounded-xl border border-[#4A515A]">
          Illustrative Demo Visualization
        </span>
      </div>

      {/* Interactive Token Strip */}
      <div className="bg-[#222831] p-4 rounded-xl border border-[#4A515A] flex flex-wrap gap-2 items-center min-h-[60px]">
        {tokens.map((tok, idx) => {
          const style = getAttentionColor(tok.attention_weight, tok.is_suspicious);
          return (
            <button
              key={idx}
              type="button"
              data-testid={`token-attention-chip-${idx}`}
              onMouseEnter={() => setActiveToken(tok)}
              onClick={() => setActiveToken(tok)}
              className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all duration-150 cursor-pointer ${style.bg} ${style.border} ${style.text} ${
                activeToken?.position === tok.position ? "ring-2 ring-[#00ADB5] scale-105" : ""
              }`}
            >
              {tok.token}
            </button>
          );
        })}
      </div>

      {/* Active Token Inspection Card */}
      {activeToken ? (
        <div className="bg-[#2B3139] border border-[#00ADB5]/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div>
            <div className="text-xs text-[#A8B0B8]">Selected Token:</div>
            <div className="font-mono text-base font-bold text-[#00ADB5]">
              "{activeToken.token}"
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[#A8B0B8]">Position: </span>
              <strong className="text-[#EEEEEE]">#{activeToken.position}</strong>
            </div>
            <div>
              <span className="text-[#A8B0B8]">Attention Weight: </span>
              <strong className="text-[#00ADB5]">
                {(activeToken.attention_weight * 100).toFixed(1)}%
              </strong>
            </div>
            <div>
              <span className="text-[#A8B0B8]">Category: </span>
              <strong className={activeToken.is_suspicious ? "text-[#EF4444]" : "text-[#22C55E]"}>
                {activeToken.is_suspicious ? "Suspicious Pattern" : "Structural / Benign"}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-[#A8B0B8] flex items-center gap-1.5 font-mono">
          <Info className="w-3.5 h-3.5 text-[#00ADB5]" />
          <span>Click or hover any token above to view its layer attention distribution.</span>
        </div>
      )}

      {/* Color Scale Legend */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#A8B0B8] pt-2 border-t border-[#4A515A]/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#EF4444]" /> High Attention (Phishing)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#00ADB5]" /> Medium Attention
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#4A515A]" /> Baseline Context
          </span>
        </div>
      </div>
    </div>
  );
}
