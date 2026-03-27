export interface CampaignRecord {
  email: string;
  estado: string; // "apertura" | "clic" | "entregado" | "desuscrito" | "spam" | "rebote"
  subject: string;
  purchase_value: number;
  age_group: string;
  product_category: string;
  desistio: number; // 0 | 1
  carro_abandonado: number; // 0 | 1
  niche: string;
  channel: string;
}

export type Channel = 'Email' | 'SMS' | 'RCS' | 'Voice';
export type Period = '7 días' | '30 días' | '90 días' | '6 meses' | '12 meses';
export type Niche = 'Todos' | 'Financiero' | 'Retail' | 'BPO' | 'Cobranza' | 'Salud';

export interface KPIMetrics {
  cargados: number;
  entregados: number;
  entregadosRate: number;
  aperturaUnica: number;
  ctr: number;
  ctor: number;
  ticketPromedio: number;
  clics: number;
  aperturas: number;
  enviados: number;
  desuscritos: number;
  rebotes: number;
  spam: number;
  carrosAbandonados: number;
  desistidos: number;
}

export interface ClaudeSegment {
  name: string;
  description: string;
  size_estimate: string;
  action: string;
  channel: string;
  best_time: string;
  tags: string[];
  priority: 'alta' | 'media' | 'baja';
  customer_ids?: string[];
}

export interface ABVersion {
  label: string;
  subject: string;
  preview: string;
  tags: string[];
  scores: Record<string, number>;
  predictions: Record<string, string>;
}

export interface EmailBodyVersion {
  preheader: string;
  body_html_structure: string;
  hero_message: string;
  cta_primary: string;
  cta_secondary?: string;
  personalization_tokens: string[];
  recommended_length: string;
}

export interface ABTest {
  version_a: ABVersion;
  version_b: ABVersion;
  winner: string;
  reason: string;
  risk: string;
  exclude_segments: string;
  email_body_suggestion?: {
    version_a: EmailBodyVersion;
    version_b: EmailBodyVersion;
  };
}

export interface TopSubject {
  subject: string;
  open_rate: string;
  impact_score: number;
  why: string;
}

export interface ClaudeResponse {
  subject: string;
  preview: string;
  tags: { label: string; color: string; text: string }[];
  scores: {
    personalizacion: number;
    relevancia_nicho: number;
    timing_optimo: number;
    potencial_recompra: number;
    asunto_score: number;
  };
  hint: string;
  segments: ClaudeSegment[];
  ab_test: ABTest;
  insights: string[];
  summary: string;
  top_subjects?: TopSubject[];
}

export interface FunnelData {
  name: string;
  value: number;
  color: string;
}

export interface InterestData {
  category: string;
  count: number;
}
