import type { KPIMetrics } from '@/types/dashboard';
import type { T } from '@/lib/translations';
import { formatCOP } from '@/lib/dataProcessing';

interface KPICardsProps {
  kpis: KPIMetrics;
  t: T;
}

function statusColor(value: number, benchmark: number): string {
  return value >= benchmark ? 'text-success-foreground' : 'text-warning-foreground';
}

function indicator(value: number, benchmark: number): string {
  return value >= benchmark ? '▲' : '▼';
}

function thresholdColor(value: number, amberThreshold: number, redThreshold: number): string {
  if (value > redThreshold) return 'text-destructive';
  if (value > amberThreshold) return 'text-warning-foreground';
  return 'text-success-foreground';
}

export default function KPICards({ kpis, t }: KPICardsProps) {
  const total = kpis.cargados || 1;
  const desuscritosRate = kpis.entregados > 0 ? (kpis.desuscritos / kpis.entregados) * 100 : 0;
  const rebotesRate = (kpis.rebotes / total) * 100;
  const spamRate = kpis.entregados > 0 ? (kpis.spam / kpis.entregados) * 100 : 0;

  const cards = [
    {
      label: t('kpi_cargados'),
      value: formatCOP(kpis.cargados),
      sub: t('kpi_registros'),
      color: 'text-foreground',
    },
    {
      label: t('kpi_entregados'),
      value: formatCOP(kpis.entregados),
      sub: `${indicator(kpis.entregadosRate, 90)} ${kpis.entregadosRate.toFixed(1)}%`,
      color: statusColor(kpis.entregadosRate, 90),
    },
    {
      label: t('kpi_apertura'),
      value: `${kpis.aperturaUnica.toFixed(1)}%`,
      sub: `${indicator(kpis.aperturaUnica, 20)} ${formatCOP(kpis.aperturas)} ${t('kpi_aperturas')}`,
      color: statusColor(kpis.aperturaUnica, 20),
    },
    {
      label: t('kpi_ctr'),
      value: `${kpis.ctr.toFixed(1)}%`,
      sub: `${indicator(kpis.ctr, 30)} ${formatCOP(kpis.clics)} ${t('kpi_clics')}`,
      color: statusColor(kpis.ctr, 30),
    },
    {
      label: t('kpi_ctor'),
      value: `${kpis.ctor.toFixed(1)}%`,
      sub: t('kpi_click_to_open'),
      color: 'text-foreground',
    },
    {
      label: t('kpi_ticket'),
      value: `$${formatCOP(kpis.ticketPromedio)}`,
      sub: t('kpi_cop'),
      color: 'text-foreground',
    },
    {
      label: t('kpi_desuscritos'),
      value: formatCOP(kpis.desuscritos),
      sub: `${desuscritosRate.toFixed(2)}% ${t('kpi_entregado_pct')}`,
      color: thresholdColor(desuscritosRate, 2, 5),
    },
    {
      label: t('kpi_rebotes'),
      value: formatCOP(kpis.rebotes),
      sub: `${rebotesRate.toFixed(2)}% ${t('kpi_total_pct')}`,
      color: thresholdColor(rebotesRate, 5, 10),
    },
    {
      label: t('kpi_spam'),
      value: formatCOP(kpis.spam),
      sub: `${spamRate.toFixed(2)}% ${t('kpi_entregado_pct')}`,
      color: thresholdColor(spamRate, 0.5, 1),
    },
    {
      label: t('kpi_carros'),
      value: formatCOP(kpis.carrosAbandonados),
      sub: t('kpi_abandon_cart'),
      color: 'text-warning-foreground',
    },
    {
      label: t('kpi_desistio'),
      value: formatCOP(kpis.desistidos),
      sub: t('kpi_desist'),
      color: 'text-warning-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 px-4 mt-4">
      {cards.map(c => (
        <div key={c.label} className="bg-secondary rounded-sm p-2.5 border border-border">
          <p className="text-[11px] text-muted-foreground font-medium">{c.label}</p>
          <p className={`text-lg font-semibold mt-0.5 ${c.color}`}>{c.value}</p>
          <p className={`text-[10px] mt-0.5 ${c.color}`}>{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
