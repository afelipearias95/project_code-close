import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import type { FunnelData, InterestData, Niche } from '@/types/dashboard';
import type { T } from '@/lib/translations';
import { formatCOP, capitalizeFirst } from '@/lib/dataProcessing';

const nicheBadgeColors: Record<string, { bg: string; text: string }> = {
  Todos: { bg: '#f0f0ea', text: '#444441' },
  Financiero: { bg: '#e6f1fb', text: '#0c447c' },
  Retail: { bg: '#faeeda', text: '#633806' },
  BPO: { bg: '#eeedfe', text: '#3c3489' },
  Cobranza: { bg: '#faece7', text: '#712b13' },
  Salud: { bg: '#eaf3de', text: '#27500a' },
};

interface ChartsRowProps {
  funnel: FunnelData[];
  interest: InterestData[];
  niche: Niche;
  openerCount: number;
  t: T;
}

export default function ChartsRow({ funnel, interest, niche, openerCount, t }: ChartsRowProps) {
  const badge = nicheBadgeColors[niche] || nicheBadgeColors.Todos;
  const maxCount = Math.max(...interest.map(d => d.count), 1);

  const interestWithCapitalized = interest.map(d => ({
    ...d,
    category: capitalizeFirst(d.category),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 mt-4">
      {/* Funnel */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-[13px] font-medium">{t('funnel_title')}</h3>
          <span
            className="text-[10px] px-2 py-0.5 rounded-[20px] font-medium"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {niche}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={funnel} layout="vertical" margin={{ left: 10, right: 50 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => formatCOP(v)} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {funnel.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
              <LabelList dataKey="value" position="right" fontSize={11} formatter={(v: number) => formatCOP(v)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interest */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-[13px] font-medium mb-0.5">{t('interest_title')}</h3>
        <p className="text-[11px] text-muted-foreground mb-3">
          {formatCOP(openerCount)} {t('interest_subtitle')}
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={interestWithCapitalized} layout="vertical" margin={{ left: 10, right: 40 }}>
            <XAxis type="number" domain={[0, maxCount]} hide />
            <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => formatCOP(v)} />
            <Bar dataKey="count" fill="#378add" radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList dataKey="count" position="right" fontSize={11} formatter={(v: number) => formatCOP(v)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
