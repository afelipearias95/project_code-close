import { useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import type { CampaignRecord, Channel, Period, Niche, ClaudeResponse } from '@/types/dashboard';
import { filterData, computeKPIs, computeFunnel, computeInterest, buildSummaryObject, isApertura } from '@/lib/dataProcessing';
import { generateSampleData } from '@/lib/sampleData';
import { createTranslator, type Lang } from '@/lib/translations';
import NavBar from '@/components/dashboard/NavBar';
import FilterBar from '@/components/dashboard/FilterBar';
import KPICards from '@/components/dashboard/KPICards';
import ChartsRow from '@/components/dashboard/ChartsRow';
import AIAnalysisCard from '@/components/dashboard/AIAnalysisCard';
import SegmentationResults from '@/components/dashboard/SegmentationResults';
import ABTestCard from '@/components/dashboard/ABTestCard';
import Footer from '@/components/dashboard/Footer';

export default function Index() {
  const [data, setData] = useState<CampaignRecord[]>([]);
  const [clientName, setClientName] = useState('');
  const [lang, setLang] = useState<Lang>('es');
  const [apiKey, setApiKey] = useState('');
  const [channel, setChannel] = useState<Channel>('Email');
  const [period, setPeriod] = useState<Period>('30 días');
  const [niche, setNiche] = useState<Niche>('Todos');
  const [analysis, setAnalysis] = useState<ClaudeResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showABTest, setShowABTest] = useState(false);

  const t = useMemo(() => createTranslator(lang), [lang]);

  const filtered = useMemo(() => filterData(data, niche), [data, niche]);
  const kpis = useMemo(() => computeKPIs(filtered), [filtered]);
  const funnel = useMemo(() => computeFunnel(kpis, t), [kpis, t]);
  const interest = useMemo(() => computeInterest(filtered), [filtered]);
  const openerCount = useMemo(() => filtered.filter(isApertura).length, [filtered]);

  const loadData = useCallback((records: CampaignRecord[], name: string) => {
    setData(records);
    setClientName(name);
    setAnalysis(null);
    setShowABTest(false);
    toast.success(`✓ ${records.length.toLocaleString('es-CO')} ${t('toast_loaded')} — ${name}`);
  }, [t]);

  const handleDemoClick = useCallback(() => {
    const records = generateSampleData(800);
    loadData(records, 'Demo Masiv 2026');
  }, [loadData]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const actualCols = Object.keys(json[0] || {});
      if (!actualCols.includes('estado')) {
        toast.warning(t('toast_missing_estado'));
        return;
      }

      const records: CampaignRecord[] = json.map((row: Record<string, unknown>) => ({
        email: String(row.email || ''),
        estado: String(row.estado || 'entregado'),
        subject: String(row.subject || ''),
        purchase_value: Number(row.purchase_value) || 0,
        age_group: String(row.age_group || 'N/A'),
        product_category: String(row.product_category || 'N/A'),
        desistio: Number(row.desistio) || 0,
        carro_abandonado: Number(row.carro_abandonado) || 0,
        niche: String(row.niche || 'financiero'),
        channel: String(row.channel || 'Email'),
      }));

      const name = file.name.replace(/\.(csv|xlsx?)$/i, '').replace(/[_-]/g, ' ');
      loadData(records, name);
    } catch {
      toast.error(t('error_file'));
    }
  }, [loadData, t]);

  const handleAnalyze = useCallback(async () => {
    if (data.length === 0) {
      setAiError(t('error_no_data'));
      return;
    }

    if (!apiKey.trim()) {
      setAiError(t('error_no_key'));
      return;
    }

    setAiError('');
    setAiLoading(true);

    const summaryObject = buildSummaryObject(filtered, kpis, channel, niche);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: `Eres un Key Account Manager (KAM) senior con más de 15 años de experiencia en servicios financieros, retail, BPO, cobranzas y salud. Te especializas en soluciones omnicanal, plataformas CPaaS, gestión de cuentas clave, análisis de datos comerciales, automatización de procesos y desarrollo de propuestas de valor. Tienes profunda experiencia en estrategias de marketing digital, optimización de campañas de email, segmentación de clientes y comunicación orientada al ROI.

Estás analizando datos de campaña de Masiv, una plataforma colombiana de comunicación masiva que envía campañas de SMS, Email, RCS y Voz.

Tu estilo de análisis es:
- Directo y comercial: lidera con el impacto en el negocio, no con la metodología
- Específico: usa cifras reales de los datos, no afirmaciones vagas
- Accionable: cada insight debe incluir una acción concreta recomendada
- Profesional: escribe como un consultor senior presentando a ejecutivos C-level`,
          messages: [{
            role: 'user',
            content: `Analiza los resultados de esta campaña de ${channel} para el sector ${niche} y genera insights ejecutivos con recomendaciones accionables.

DATOS DE LA CAMPAÑA:
${JSON.stringify(summaryObject)}

Responde ÚNICAMENTE con JSON válido, sin texto adicional ni bloques markdown:
{
  "top_subjects": [
    {
      "subject": "texto del asunto",
      "open_rate": "X%",
      "impact_score": 0,
      "why": "explicación en una oración"
    }
  ],
  "subject": "asunto recomendado con [nombre] personalizado",
  "preview": "explicación de 2-3 oraciones del razonamiento",
  "tags": [{"label": "string", "color": "hex bg", "text": "hex text"}],
  "scores": {
    "personalizacion": 0,
    "relevancia_nicho": 0,
    "timing_optimo": 0,
    "potencial_recompra": 0,
    "asunto_score": 0
  },
  "hint": "recomendaciones tácticas en 1-2 oraciones",
  "segments": [
    {
      "name": "nombre del segmento",
      "description": "descripción en 1 oración",
      "size_estimate": "ej: ~120 contactos (24%)",
      "action": "acción concreta para próximo envío",
      "channel": "Email o SMS",
      "best_time": "ej: martes 10am",
      "tags": ["tag1", "tag2"],
      "priority": "alta | media | baja",
      "customer_ids": []
    }
  ],
  "ab_test": {
    "version_a": {
      "label": "Versión A — Control",
      "subject": "asunto versión A",
      "preview": "preview copy A",
      "tags": ["tag1"],
      "scores": {"claridad": 0, "urgencia": 0, "personalizacion": 0},
      "predictions": {"apertura": "7-9%", "ctr": "1.6%", "desubscripcion": "~18%"}
    },
    "version_b": {
      "label": "Versión B — Recomendada IA",
      "subject": "asunto versión B",
      "preview": "preview copy B",
      "tags": ["tag1"],
      "scores": {"claridad": 0, "urgencia": 0, "personalizacion": 0},
      "predictions": {"apertura": "12-15%", "ctr": "2.4%", "desubscripcion": "~9%"}
    },
    "winner": "B",
    "reason": "explicación de por qué B gana",
    "risk": "riesgo a monitorear",
    "exclude_segments": "segmentos a excluir",
    "email_body_suggestion": {
      "version_a": {
        "preheader": "texto de preheader",
        "body_html_structure": "descripción de estructura recomendada",
        "hero_message": "mensaje principal",
        "cta_primary": "texto del CTA principal",
        "cta_secondary": "texto del CTA secundario (opcional)",
        "personalization_tokens": ["[nombre]", "[empresa]"],
        "recommended_length": "corto/medio/largo con conteo de palabras"
      },
      "version_b": {
        "preheader": "texto de preheader",
        "body_html_structure": "descripción de estructura recomendada",
        "hero_message": "mensaje principal",
        "cta_primary": "texto del CTA principal",
        "cta_secondary": "texto del CTA secundario (opcional)",
        "personalization_tokens": ["[nombre]", "[empresa]"],
        "recommended_length": "corto/medio/largo con conteo de palabras"
      }
    }
  },
  "insights": ["insight 1", "insight 2", "insight 3"],
  "summary": "resumen ejecutivo en 2 oraciones con cifras concretas"
}`
          }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
      }

      const resJson = await res.json();
      const text = resJson.content[0].text;

      try {
        const parsed: ClaudeResponse = JSON.parse(text);
        setAnalysis(parsed);
      } catch {
        setAiError('Error parseando respuesta JSON de Claude.');
        console.error('Raw Claude response:', text);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setAiError(message);
    } finally {
      setAiLoading(false);
    }
  }, [data, filtered, kpis, channel, niche, t]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar
        clientName={clientName}
        onFileUpload={handleFileUpload}
        onDemoClick={handleDemoClick}
        lang={lang}
        onLangToggle={() => setLang(l => l === 'es' ? 'en' : 'es')}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        t={t}
      />

      <FilterBar
        channel={channel}
        period={period}
        niche={niche}
        onChannelChange={setChannel}
        onPeriodChange={setPeriod}
        onNicheChange={setNiche}
        t={t}
      />

      {data.length > 0 ? (
        <>
          <KPICards kpis={kpis} t={t} />
          <ChartsRow funnel={funnel} interest={interest} niche={niche} openerCount={openerCount} t={t} />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-[14px] text-muted-foreground mb-2">{t('no_data')}</p>
            <p className="text-[12px] text-muted-foreground">{t('no_data_hint')}</p>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <AIAnalysisCard
          analysis={analysis}
          loading={aiLoading}
          error={aiError}
          onAnalyze={handleAnalyze}
          onCreateABTest={() => setShowABTest(true)}
          t={t}
        />
      )}

      {analysis && analysis.segments && (
        <SegmentationResults
          segments={analysis.segments}
          insights={analysis.insights || []}
          summary={analysis.summary || ''}
          allRecords={filtered}
          t={t}
        />
      )}

      {showABTest && analysis?.ab_test && (
        <ABTestCard
          abTest={analysis.ab_test}
          totalDelivered={kpis.entregados}
          campaignName={clientName}
          t={t}
        />
      )}

      <div className="flex-1" />
      <Footer t={t} />
    </div>
  );
}
