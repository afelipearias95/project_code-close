import { Upload, FlaskConical, Globe } from 'lucide-react';
import type { T, Lang } from '@/lib/translations';

interface NavBarProps {
  clientName: string;
  onFileUpload: (file: File) => void;
  onDemoClick: () => void;
  lang: Lang;
  onLangToggle: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  t: T;
}

export default function NavBar({ clientName, onFileUpload, onDemoClick, lang, onLangToggle, apiKey, onApiKeyChange, t }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
        <span className="inline-block bg-primary text-primary-foreground text-[10px] font-semibold tracking-[0.5px] px-2 py-1 rounded-[5px] shrink-0">
          MASIV
        </span>
        <p className="text-sm font-medium text-foreground leading-tight">{t('dashboard_title')}</p>
        <span
          className="text-[11px] font-medium px-2.5 py-0.5 rounded-[20px] whitespace-nowrap"
          style={{ backgroundColor: '#1a3a5c', color: '#ffffff' }}
        >
          {t('client_label')}: Code&amp;Close_Retail_Éxito
        </span>
        <p className="text-[11px] text-muted-foreground truncate">
          {clientName || t('load_to_start')}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="password"
          value={apiKey}
          onChange={e => onApiKeyChange(e.target.value)}
          placeholder="sk-ant-api03-..."
          className="text-[11px] px-3 py-1.5 rounded-[20px] border border-border bg-background text-foreground placeholder:text-muted-foreground w-44 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.xlsx,.xls';
            input.onchange = (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) onFileUpload(f);
            };
            input.click();
          }}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-[20px] border border-border text-foreground hover:bg-secondary transition-colors"
        >
          <Upload size={13} />
          {t('upload_report')}
        </button>

        <button
          onClick={onDemoClick}
          className="text-[11px] font-medium px-3 py-1.5 rounded-[20px] text-muted-foreground hover:bg-secondary transition-colors"
        >
          <FlaskConical size={13} className="inline mr-1" />
          {t('quick_demo')}
        </button>

        <button className="text-[11px] font-medium px-3 py-1.5 rounded-[20px] border border-border text-foreground hover:bg-secondary transition-colors">
          {t('export')} ↗
        </button>

        <button
          onClick={onLangToggle}
          className="inline-flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-[20px] border border-border text-foreground hover:bg-secondary transition-colors"
          title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe size={13} />
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
    </nav>
  );
}
