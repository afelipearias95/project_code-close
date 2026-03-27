import { Sparkles, Download } from 'lucide-react';
import type { ClaudeSegment, CampaignRecord } from '@/types/dashboard';
import type { T } from '@/lib/translations';
import { capitalizeFirst } from '@/lib/dataProcessing';

interface SegmentationResultsProps {
  segments: ClaudeSegment[];
  insights: string[];
  summary: string;
  allRecords: CampaignRecord[];
  t: T;
}

const priorityColors: Record<string, { bg: string; text: string }> = {
  alta: { bg: '#eaf3de', text: '#27500a' },
  media: { bg: '#faeeda', text: '#633806' },
  baja: { bg: '#f0f0ea', text: '#444441' },
};

function downloadSegmentCSV(seg: ClaudeSegment, allRecords: CampaignRecord[]) {
  const name = seg.name.toLowerCase().replace(/\s+/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  const filename = `segmento_${name}_${date}.csv`;

  let rows: CampaignRecord[];
  if (seg.customer_ids && seg.customer_ids.length > 0) {
    const idSet = new Set(seg.customer_ids);
    rows = allRecords.filter(r => idSet.has(r.email));
  } else {
    rows = allRecords;
  }

  const header = 'email,subject,age_group,product_category,estado,purchase_value,desistio,carro_abandonado';
  const body = rows.map(r =>
    [r.email, `"${(r.subject || '').replace(/"/g, '""')}"`, r.age_group, r.product_category, r.estado, r.purchase_value, r.desistio, r.carro_abandonado].join(',')
  );
  const csv = [header, ...body].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SegmentationResults({ segments, insights, summary, allRecords, t }: SegmentationResultsProps) {
  return (
    <div className="mx-4 mt-4 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[13px] font-medium">{t('seg_title')}</h3>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-[20px] bg-ai-bg text-ai-foreground">
          <Sparkles size={10} />
          IA
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {segments.map((seg, i) => {
          const p = priorityColors[seg.priority] || priorityColors.baja;
          return (
            <div key={i} className="bg-card border border-border rounded-lg p-3.5 flex flex-col">
              <p className="text-[13px] font-medium mb-1">{seg.name}</p>
              <p className="text-[11px] text-muted-foreground mb-1">{seg.description}</p>
              <p className="text-[11px] text-muted-foreground mb-2">{seg.size_estimate}</p>
              <div className="bg-ai-bg text-[11px] text-ai-foreground rounded-md px-2 py-1.5 mb-2">
                {seg.action}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-[20px] bg-accent/20 text-accent font-medium">
                  {seg.channel}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-[20px] bg-ai-bg text-ai-foreground font-medium">
                  {seg.best_time}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-[20px] font-medium"
                  style={{ backgroundColor: p.bg, color: p.text }}
                >
                  {seg.priority}
                </span>
                {seg.tags.map((tag, j) => (
                  <span key={j} className="text-[10px] px-2 py-0.5 rounded-[20px] bg-secondary text-muted-foreground">
                    {capitalizeFirst(tag)}
                  </span>
                ))}
              </div>
              <button
                onClick={() => downloadSegmentCSV(seg, allRecords)}
                className="mt-auto w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-[20px] border border-border text-foreground hover:bg-secondary transition-colors"
              >
                <Download size={12} />
                {t('download_report')}
              </button>
            </div>
          );
        })}
      </div>

      {insights.length > 0 && (
        <div className="mt-3 space-y-2">
          {insights.map((ins, i) => (
            <div key={i} className="border-l-2 bg-ai-bg text-[11px] text-ai-foreground px-3 py-2 rounded-r-md" style={{ borderColor: '#534AB7' }}>
              {ins}
            </div>
          ))}
        </div>
      )}

      {summary && (
        <div className="mt-3 bg-secondary text-[12px] text-muted-foreground px-3 py-2.5 rounded-sm">
          {summary}
        </div>
      )}
    </div>
  );
}
