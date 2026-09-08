import { Cpu, Layers, Sparkles, Terminal, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ModelsPage() {
  const models = [
    {
      name: "DistilBERT (PhishBERT-Fast)",
      tag: "Default Production Engine",
      layers: "6 Transformer Encoder Layers",
      heads: "12 Self-Attention Heads",
      dim: "768 Hidden Embedding Dimension",
      params: "66 Million Parameters",
      vocab: "30,522 WordPiece Tokens",
      latency: "18.4 ms Avg Latency",
      accuracy: "97.4%",
      desc: "Distilled from BERT with 40% parameter reduction while retaining 97% of contextual language understanding. Ideal for real-time edge security and inline proxy scanning."
    },
    {
      name: "BERT-Base-Uncased",
      tag: "Deep Bidirectional Context",
      layers: "12 Bidirectional Encoder Layers",
      heads: "12 Multi-Head Attention Heads",
      dim: "768 Hidden Embedding Dimension",
      params: "110 Million Parameters",
      vocab: "30,522 WordPiece Tokens",
      latency: "45.2 ms Avg Latency",
      accuracy: "98.7%",
      desc: "Full bidirectional self-attention capturing left-to-right and right-to-left subword token correlations across domain, path, and query structures."
    },
    {
      name: "RoBERTa-Large",
      tag: "Robustly Optimized BPE",
      layers: "24 Encoder Layers",
      heads: "16 Self-Attention Heads",
      dim: "1024 Hidden Embedding Dimension",
      params: "355 Million Parameters",
      vocab: "50,265 Byte-Pair Tokens",
      latency: "62.8 ms Avg Latency",
      accuracy: "99.1%",
      desc: "Trained on byte-level subword encodings with dynamic masking for maximum resilience against deliberate obfuscation and adversarial character mutations."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#00ADB5]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
            Inside the Transformer Architecture
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
          Deep contextual representations, subword tokenization mechanisms, and multi-head self-attention mechanics.
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((m, idx) => (
          <div
            key={idx}
            className="bg-[#393E46] border border-[#4A515A] hover:border-[#00ADB5]/50 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono bg-[#0B3B40] text-[#00ADB5] px-2 py-0.5 rounded border border-[#00ADB5]/30">
                  {m.tag}
                </span>
                <span className="text-xs font-mono font-bold text-[#22C55E]">
                  {m.accuracy} Acc
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#EEEEEE] font-mono">
                {m.name}
              </h3>

              <p className="text-xs text-[#A8B0B8] leading-relaxed">
                {m.desc}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-[#4A515A] font-mono text-xs text-[#A8B0B8]">
                <div className="flex justify-between">
                  <span>Depth:</span>
                  <span className="text-[#EEEEEE]">{m.layers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attention Heads:</span>
                  <span className="text-[#EEEEEE]">{m.heads}</span>
                </div>
                <div className="flex justify-between">
                  <span>Embedding Dim:</span>
                  <span className="text-[#00ADB5]">{m.dim}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parameters:</span>
                  <span className="text-[#EEEEEE]">{m.params}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vocabulary:</span>
                  <span className="text-[#EEEEEE]">{m.vocab}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Latency:</span>
                  <span className="text-[#00ADB5] font-bold">{m.latency}</span>
                </div>
              </div>
            </div>

            <Link
              to="/scanner"
              className="w-full bg-[#2B3139] hover:bg-[#00ADB5] hover:text-[#222831] text-[#EEEEEE] text-xs font-bold py-2.5 rounded-xl border border-[#4A515A] flex items-center justify-center gap-2 transition-all mt-4"
            >
              <span>Test This Model</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Deep Dive Section */}
      <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-[#EEEEEE] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00ADB5]" />
          <span>Why Subword Tokenization Beats Character & Word Models</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#A8B0B8] leading-relaxed">
          Traditional word tokenizers treat <code className="text-[#00ADB5] font-mono">paypal-update-verify.com</code> as out-of-vocabulary (OOV) tokens, while character-level RNNs lack long-range contextual dependencies. By employing WordPiece and BPE tokenization, Transformers segment deceptive URLs into semantic components: <code className="text-[#00ADB5] font-mono">["pay", "##pal", "-", "update", "-", "verify", ".", "com"]</code>. The multi-head self-attention mechanism then calculates that <code className="text-[#00ADB5] font-mono">"paypal"</code> appearing alongside <code className="text-[#00ADB5] font-mono">"update"</code> outside the authentic root authority represents a 95%+ probability of targeted brand impersonation.
        </p>
      </div>
    </div>
  );
}
