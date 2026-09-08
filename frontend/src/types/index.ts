export type PredictionType = "PHISHING" | "LEGITIMATE" | "SUSPICIOUS";
export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "SAFE";
export type ModelType = "DistilBERT" | "BERT" | "RoBERTa";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  api_key: string;
  created_at: string;
  scans_count: number;
}

export interface URLAnatomy {
  full_url: string;
  normalized_url: string;
  protocol: string;
  has_https: boolean;
  host: string;
  domain: string;
  subdomain: string;
  tld: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
  num_params: number;
  url_length: number;
  domain_length: number;
  path_length: number;
  entropy: number;
  special_chars_count: number;
  digits_count: number;
  is_ip_host: boolean;
}

export interface TokenAttentionItem {
  token: string;
  position: number;
  attention_weight: number;
  is_suspicious: boolean;
  embedding_dim: number;
}

export interface ThreatIndicatorItem {
  id: string;
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  weight: number;
  description: string;
  recommendation: string;
}

export interface CounterfactualItem {
  factor: string;
  delta_risk: number;
  explanation: string;
}

export interface ModelConsensusItem {
  prediction: PredictionType;
  confidence: number;
  latency_ms: number;
  risk_score: number;
}

export interface HomoglyphAnalysis {
  is_punycode: boolean;
  decoded_host: string;
  has_homoglyphs: boolean;
  impersonated_brand: string | null;
  similarity_score: number;
}

export interface ScanResult {
  id: string;
  url: string;
  prediction: PredictionType;
  risk_level: RiskLevel;
  risk_score: number;
  confidence: number;
  model_name: ModelType;
  inference_time_ms: number;
  threshold: number;
  is_demo_analysis: boolean;
  created_at: string;
  anatomy: URLAnatomy;
  tokens: TokenAttentionItem[];
  indicators: ThreatIndicatorItem[];
  counterfactuals: CounterfactualItem[];
  consensus: Record<string, ModelConsensusItem>;
  consensus_agreement: number;
  novelty_score: number;
  robustness_score: number;
  homoglyph_analysis: HomoglyphAnalysis;
  user_id?: string | null;
  feedback?: string | null;
}

export interface ScanRequest {
  url: string;
  model?: ModelType;
  user_id?: string | null;
  save_history?: boolean;
}

export interface BatchItemResult {
  id: string;
  url: string;
  prediction: PredictionType;
  risk_score: number;
  confidence: number;
  risk_level: RiskLevel;
  indicators_count: number;
  inference_time_ms: number;
}

export interface BatchScanResponse {
  batch_id: string;
  total_processed: number;
  phishing_count: number;
  legitimate_count: number;
  suspicious_count: number;
  avg_risk_score: number;
  avg_inference_ms: number;
  model_used: string;
  created_at: string;
  results: BatchItemResult[];
}

export interface PerturbationResult {
  attack_type: string;
  original_url: string;
  perturbed_url: string;
  original_risk: number;
  perturbed_risk: number;
  risk_delta: number;
  is_evasion_successful: boolean;
  explanation: string;
}

export interface AdversarialTestResponse {
  original_url: string;
  model: string;
  perturbations: PerturbationResult[];
  overall_robustness_score: number;
  tested_at: string;
}

export interface UnicodeChar {
  character: string;
  unicode: string;
  script: string;
  is_ascii: boolean;
  ascii_replacement: string;
}

export interface HomographCheckResponse {
  input_domain: string;
  is_punycode: boolean;
  decoded_domain: string;
  has_homoglyphs: boolean;
  impersonated_brand: string | null;
  similarity_score: number;
  risk_assessment: string;
  unicode_breakdown: UnicodeChar[];
}

export interface DriftMetrics {
  timeframe: string;
  baseline_accuracy: number;
  current_accuracy: number;
  drift_score: number;
  drift_detected: boolean;
  concept_drift_features: Array<{
    feature: string;
    importance: number;
    drift_status: string;
  }>;
  adversarial_trend: Array<{
    month: string;
    accuracy: number;
    drift_index: number;
  }>;
}

export interface CampaignCluster {
  cluster_id: string;
  campaign_name: string;
  target_brand: string;
  threat_actor_sig: string;
  pattern_signature: string;
  active_urls_count: number;
  avg_risk_score: number;
  first_seen: string;
  sample_urls: string[];
}

export interface ModelMetric {
  model_id: string;
  name: string;
  architecture: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  false_positive_rate: number;
  avg_latency_ms: number;
  parameters: string;
  vocab_size: string;
}

export interface ConfusionMatrix {
  model_id: string;
  true_positive: number;
  false_positive: number;
  true_negative: number;
  false_negative: number;
}

export interface CurvePoint {
  x: number;
  y: number;
  model_id: string;
}

export interface BenchmarkReport {
  evaluation_label: string;
  total_test_samples: number;
  dataset_description: string;
  models: ModelMetric[];
  confusion_matrices: ConfusionMatrix[];
  roc_curve: CurvePoint[];
  pr_curve: CurvePoint[];
  feature_importance: Array<{
    feature: string;
    importance: number;
    type: string;
  }>;
}

export interface ScansSummary {
  is_demo_data: boolean;
  total_scans: number;
  phishing_detected: number;
  legitimate_urls: number;
  suspicious_urls: number;
  avg_confidence: number;
  recent_scans: ScanResult[];
}
