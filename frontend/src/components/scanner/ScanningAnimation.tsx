import { useEffect, useState } from "react";
import { Cpu, CheckCircle2, Shield, Network, Terminal, Layers, Sparkles } from "lucide-react";

interface ScanningAnimationProps {
  url: string;
  modelName: string;
  onComplete: () => void;
}

const STAGES = [
  { id: 1, name: "URL Received", desc: "Validating format and syntax...", icon: CheckCircle2 },
  { id: 2, name: "Preprocessing", desc: "Decomposing protocol, host, subdomains & query tree...", icon: Layers },
  { id: 3, name: "Subword Tokenization", desc: "Generating WordPiece / Byte-Pair token sequences...", icon: Terminal },
  { id: 4, name: "Transformer Attention Analysis", desc: "Executing 12-head contextual attention layers...", icon: Cpu },
  { id: 5, name: "Feature Fusion & Entropy", desc: "Synthesizing lexical, homoglyph & structural metrics...", icon: Network },
  { id: 6, name: "Security Verdict Generation", desc: "Computing risk score & generating explainability reports...", icon: Shield }
];

export function ScanningAnimation({ url, modelName, onComplete }: ScanningAnimationProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [displayedTokens, setDisplayedTokens] = useState<string[]>([]);

  useEffect(() => {
    // Generate simulated tokens from the URL for visual flair
    const rawTokens = url
      .replace(/https?:\/\//, "")
      .split(/[/.:?&=#@%_\-+]/)
      .filter(Boolean)
      .slice(0, 8);
    setDisplayedTokens(rawTokens);

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= STAGES.length) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [url, onComplete]);

  return (
    <div
      data-testid="scanner-multi-stage-animation"
      className="bg-[#393E46] border border-[#00ADB5]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 animate-in fade-in"
    >
      {/* Background Pulse Effect */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-[#00ADB5]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#4A515A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ADB5] animate-ping" />
            <span className="text-xs font-mono uppercase text-[#00ADB5] tracking-wider font-semibold">
              Live Neural Inference Pipeline
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#EEEEEE] mt-0.5">
            Processing URL with <span className="text-[#00ADB5]">{modelName}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-[#2B3139] px-3 py-1 rounded-xl border border-[#4A515A] text-xs font-mono text-[#A8B0B8]">
          <Sparkles className="w-3.5 h-3.5 text-[#00ADB5]" />
          <span>Stage {currentStage} of {STAGES.length}</span>
        </div>
      </div>

      {/* Current URL Stream Banner */}
      <div className="bg-[#2B3139] p-3 rounded-xl border border-[#4A515A] font-mono text-xs text-[#EEEEEE] truncate">
        <span className="text-[#00ADB5] mr-2">INPUT_URI:</span>
        <span className="text-[#EEEEEE]">{url}</span>
      </div>

      {/* Token Particle Stream Visualization */}
      {currentStage >= 3 && (
        <div className="bg-[#222831] p-3 rounded-xl border border-[#00ADB5]/30 space-y-2 animate-in fade-in duration-300">
          <div className="text-[10px] uppercase font-mono text-[#A8B0B8] flex items-center justify-between">
            <span>Contextual Token Stream:</span>
            <span className="text-[#00ADB5]">768-dim Embedding Vector</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {displayedTokens.map((tok, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2 py-0.5 rounded bg-[#393E46] border border-[#00ADB5]/50 text-[#EEEEEE] animate-pulse"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                [{tok}]
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Vertical Pipeline Stage Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {STAGES.map((stg) => {
          const isDone = currentStage > stg.id;
          const isCurrent = currentStage === stg.id;
          const Icon = stg.icon;

          return (
            <div
              key={stg.id}
              className={`p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                isCurrent
                  ? "bg-[#0B3B40] border-[#00ADB5] shadow-md shadow-[#00ADB5]/20 scale-[1.01]"
                  : isDone
                  ? "bg-[#2B3139] border-[#22C55E]/40 opacity-90"
                  : "bg-[#2B3139]/50 border-[#4A515A] opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isCurrent
                    ? "bg-[#00ADB5] text-[#222831] animate-pulse"
                    : isDone
                    ? "bg-[#22C55E] text-[#222831]"
                    : "bg-[#4A515A] text-[#A8B0B8]"
                }`}
              >
                {isDone ? "✓" : stg.id}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#EEEEEE] flex items-center gap-1.5">
                  <span>{stg.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] text-[#00ADB5] font-mono uppercase animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#A8B0B8] truncate">{stg.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#2B3139] h-2 rounded-full overflow-hidden border border-[#4A515A]">
        <div
          className="h-full bg-gradient-to-r from-[#00ADB5] to-[#19C3CC] transition-all duration-300"
          style={{ width: `${(currentStage / STAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
