import { BookOpen, FileText, Download, Shield, ExternalLink, Award } from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-[#4A515A]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#00ADB5]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
            Methodology & Research Whitepaper
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#A8B0B8] mt-1">
          Academic foundation and implementation details for "Transformer-Based Phishing Website Detection and URL Classification".
        </p>
      </div>

      {/* Abstract Card */}
      <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#4A515A]">
          <span className="text-xs uppercase font-mono font-bold text-[#00ADB5]">
            ACADEMIC ABSTRACT
          </span>
          <span className="text-[11px] font-mono text-[#A8B0B8]">
            Published March 2026
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#EEEEEE] leading-relaxed">
          Modern phishing campaigns increasingly exploit dynamic cloud domains, character-level homoglyphs, and nested subdomains to bypass conventional blacklist filters and shallow machine learning heuristics. In this work, we present <strong>PHISHNEXA</strong>, a hybrid framework that synergizes pre-trained Transformer encoders (DistilBERT, BERT-base, RoBERTa) with lexical entropy metrics and Levenshtein brand lookalike detection.
        </p>

        <p className="text-xs sm:text-sm text-[#A8B0B8] leading-relaxed">
          Evaluated across a stratified corpus of 50,000 ground-truth URLs (sourced from PhishTank, OpenPhish, APWG, and Tranco Top 10K), our DistilBERT configuration achieves <strong>97.4% accuracy</strong> and <strong>98.1% recall</strong> with an average inference latency of <strong>18.4 milliseconds</strong>, demonstrating high real-time viability for automated Security Operations Center (SOC) defense pipelines.
        </p>
      </div>

      {/* Dataset & Methodology */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 space-y-2">
          <h3 className="text-sm font-bold text-[#EEEEEE] font-mono">
            1. Stratified Data Ingestion
          </h3>
          <p className="text-xs text-[#A8B0B8] leading-relaxed">
            Curated 25,000 verified malicious URLs from anti-phishing feeds balanced against 25,000 authoritative Tranco top domains to eliminate class bias.
          </p>
        </div>

        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 space-y-2">
          <h3 className="text-sm font-bold text-[#EEEEEE] font-mono">
            2. Multi-Head Feature Fusion
          </h3>
          <p className="text-xs text-[#A8B0B8] leading-relaxed">
            Self-attention embeddings from Transformer encoder layers are concatenated with 10 structural lexical attributes and Shannon entropy vectors.
          </p>
        </div>

        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 space-y-2">
          <h3 className="text-sm font-bold text-[#EEEEEE] font-mono">
            3. Adversarial Robustness
          </h3>
          <p className="text-xs text-[#A8B0B8] leading-relaxed">
            Evaluated against character substitutions, IDN homoglyphs, and query parameter padding to ensure resistance to evasion attempts.
          </p>
        </div>

        <div className="bg-[#393E46] border border-[#4A515A] rounded-2xl p-6 space-y-2">
          <h3 className="text-sm font-bold text-[#EEEEEE] font-mono">
            4. Explainable Security Reasoning
          </h3>
          <p className="text-xs text-[#A8B0B8] leading-relaxed">
            Counterfactual explainability maps provide SOC analysts with actionable rationale rather than opaque black-box probability values.
          </p>
        </div>
      </div>
    </div>
  );
}
