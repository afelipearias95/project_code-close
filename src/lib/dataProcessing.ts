import type { CampaignRecord, KPIMetrics, FunnelData, InterestData, Niche } from '@/types/dashboard';
import type { T } from '@/lib/translations';

// Estado helpers
export const isEntregado = (r: CampaignRecord): boolean =>
  r.estado === 'entregado' || ['apertura', 'clic', 'desuscrito', 'spam', 'rebote'].includes(r.estado);
export const isApertura = (r: CampaignRecord): boolean =>
  r.estado === 'apertura' || r.estado === 'clic';
export const isClic = (r: CampaignRecord): boolean => r.estado === 'clic';
export const isDesuscrito = (r: CampaignRecord): boolean => r.estado === 'desuscrito';
export const isRebote = (r: CampaignRecord): boolean => r.estado === 'rebote';
export const isSpam = (r: CampaignRecord): boolean => r.estado === 'spam';
export const isPurchased = (r: CampaignRecord): boolean => Number(r.purchase_value) > 0;
export const isDesistio = (r: CampaignRecord): boolean => Number(r.desistio) === 1;
export const isCarroAbandonado = (r: CampaignRecord): boolean => Number(r.carro_abandonado) === 1;

export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function filterData(data: CampaignRecord[], niche: Niche): CampaignRecord[] {
  if (niche === 'Todos') return data;
  return data.filter(r => r.niche.toLowerCase() === niche.toLowerCase());
}

export function computeKPIs(data: CampaignRecord[]): KPIMetrics {
  const total = data.length;
  if (total === 0) return {
    cargados: 0, entregados: 0, entregadosRate: 0, aperturaUnica: 0,
    ctr: 0, ctor: 0, ticketPromedio: 0, clics: 0, aperturas: 0, enviados: 0,
    desuscritos: 0, rebotes: 0, spam: 0, carrosAbandonados: 0, desistidos: 0,
  };

  const entregados = data.filter(isEntregado).length;
  const aperturas = data.filter(isApertura).length;
  const clics = data.filter(isClic).length;
  const desuscritos = data.filter(isDesuscrito).length;
  const rebotes = data.filter(isRebote).length;
  const spamCount = data.filter(isSpam).length;
  const carrosAbandonados = data.filter(isCarroAbandonado).length;
  const desistidos = data.filter(isDesistio).length;
  const purchasers = data.filter(isPurchased);
  const totalRevenue = data.reduce((s, r) => s + r.purchase_value, 0);
  const activeUsers = purchasers.length || 1;

  return {
    cargados: total,
    enviados: Math.round(total * 0.98),
    entregados,
    entregadosRate: (entregados / total) * 100,
    aperturaUnica: entregados > 0 ? (aperturas / entregados) * 100 : 0,
    ctr: entregados > 0 ? (clics / entregados) * 100 : 0,
    ctor: aperturas > 0 ? (clics / aperturas) * 100 : 0,
    ticketPromedio: Math.round(totalRevenue / activeUsers),
    clics,
    aperturas,
    desuscritos,
    rebotes,
    spam: spamCount,
    carrosAbandonados,
    desistidos,
  };
}

export function computeFunnel(kpis: KPIMetrics, t: T): FunnelData[] {
  return [
    { name: t('funnel_cargados'), value: kpis.cargados, color: '#b5d4f4' },
    { name: t('funnel_enviados'), value: kpis.enviados, color: '#85b7eb' },
    { name: t('funnel_entregados'), value: kpis.entregados, color: '#378add' },
    { name: t('funnel_aperturas'), value: kpis.aperturas, color: '#1d9e75' },
    { name: t('funnel_clics'), value: kpis.clics, color: '#0f6e56' },
  ];
}

export function computeInterest(data: CampaignRecord[]): InterestData[] {
  const openers = data.filter(isApertura);
  const catCount: Record<string, number> = {};
  openers.forEach(r => {
    catCount[r.product_category] = (catCount[r.product_category] || 0) + 1;
  });
  return Object.entries(catCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function buildSummaryObject(data: CampaignRecord[], kpis: KPIMetrics, channel: string, niche: string) {
  const ageBreakdown: Record<string, { total: number; clicked: number; purchased: number; revenue: number }> = {};
  data.forEach(r => {
    if (!ageBreakdown[r.age_group]) ageBreakdown[r.age_group] = { total: 0, clicked: 0, purchased: 0, revenue: 0 };
    ageBreakdown[r.age_group].total++;
    if (isClic(r)) ageBreakdown[r.age_group].clicked++;
    if (isPurchased(r)) ageBreakdown[r.age_group].purchased++;
    ageBreakdown[r.age_group].revenue += r.purchase_value;
  });

  const catBreakdown: Record<string, { purchases: number; revenue: number }> = {};
  data.forEach(r => {
    if (!catBreakdown[r.product_category]) catBreakdown[r.product_category] = { purchases: 0, revenue: 0 };
    if (isPurchased(r)) catBreakdown[r.product_category].purchases++;
    catBreakdown[r.product_category].revenue += r.purchase_value;
  });

  const subjectPerformance: Record<string, { sent: number; opens: number; clicks: number; purchases: number }> = {};
  data.forEach(r => {
    const s = r.subject || '(sin asunto)';
    if (!subjectPerformance[s]) subjectPerformance[s] = { sent: 0, opens: 0, clicks: 0, purchases: 0 };
    subjectPerformance[s].sent++;
    if (isApertura(r)) subjectPerformance[s].opens++;
    if (isClic(r)) subjectPerformance[s].clicks++;
    if (isPurchased(r)) subjectPerformance[s].purchases++;
  });

  return {
    kpis: {
      total: kpis.cargados,
      delivered: kpis.entregados,
      delivery_rate: kpis.entregadosRate.toFixed(1),
      open_rate: kpis.aperturaUnica.toFixed(1),
      ctr: kpis.ctr.toFixed(1),
      ctor: kpis.ctor.toFixed(1),
      avg_ticket: kpis.ticketPromedio,
      desuscritos: kpis.desuscritos,
      rebotes: kpis.rebotes,
      spam: kpis.spam,
      carros_abandonados: kpis.carrosAbandonados,
      desistidos: kpis.desistidos,
    },
    age_breakdown: ageBreakdown,
    category_breakdown: catBreakdown,
    subject_performance: subjectPerformance,
    channel,
    niche,
    total_records: data.length,
  };
}

export function formatCOP(value: number): string {
  return value.toLocaleString('es-CO');
}
