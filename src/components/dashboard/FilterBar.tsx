import type { Channel, Period, Niche } from '@/types/dashboard';
import type { T } from '@/lib/translations';
import { toast } from 'sonner';

interface FilterBarProps {
  channel: Channel;
  period: Period;
  niche: Niche;
  onChannelChange: (c: Channel) => void;
  onPeriodChange: (p: Period) => void;
  onNicheChange: (n: Niche) => void;
  t: T;
}

const channels: Channel[] = ['Email', 'SMS', 'RCS', 'Voice'];
const periods: Period[] = ['7 días', '30 días', '90 días', '6 meses', '12 meses'];
const niches: Niche[] = ['Todos', 'Financiero', 'Retail', 'BPO', 'Cobranza', 'Salud'];

function Pill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] px-3 py-1 rounded-[20px] font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'border border-border text-foreground hover:bg-secondary'
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ channel, period, niche, onChannelChange, onPeriodChange, onNicheChange, t }: FilterBarProps) {
  const handleChannel = (c: Channel) => {
    if (c !== 'Email') {
      toast(t('canal_unavailable'), { icon: '🔜' });
      return;
    }
    onChannelChange(c);
  };

  return (
    <div className="bg-secondary rounded-sm mx-4 mt-3 px-3.5 py-2.5 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground font-medium mr-1">{t('canal')}</span>
        {channels.map(c => (
          <Pill key={c} active={channel === c} label={c} onClick={() => handleChannel(c)} />
        ))}
      </div>

      <div className="w-px h-5 bg-border hidden sm:block" />

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground font-medium mr-1">{t('periodo')}</span>
        {periods.map(p => (
          <Pill key={p} active={period === p} label={p} onClick={() => onPeriodChange(p)} />
        ))}
      </div>

      <div className="w-px h-5 bg-border hidden sm:block" />

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground font-medium mr-1">{t('sector')}</span>
        {niches.map(n => (
          <Pill key={n} active={niche === n} label={n} onClick={() => onNicheChange(n)} />
        ))}
      </div>
    </div>
  );
}
