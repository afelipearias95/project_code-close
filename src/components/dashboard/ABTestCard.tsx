import type { ABTest, EmailBodyVersion } from '@/types/dashboard';
import type { T } from '@/lib/translations';

interface ABTestCardProps {
  abTest: ABTest;
  totalDelivered: number;
  campaignName: string;
  t: T;
}

function VersionCard({ version, recommended, recommendedLabel }: { version: ABTest['version_a']; recommended: boolean; recommendedLabel: string }) {
  const scores = Object.entries(version.scores);
  const predictions = Object.entries(version.predictions);

  return (
    <div className={`bg-card border rounded-lg p-4 ${recommended ? 'border-success border-2' : 'border-border'}`}>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-[13px] font-medium">{version.label}</p>
        {recommended && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-[20px] bg-success/10 text-success">
            {recommendedLabel}
          </span>
        )}
      </div>

      <div className={`bg-secondary px-3 py-2 rounded-md mb-2 border-l-2 ${recommended ? 'border-success' : 'border-muted-foreground/30'}`}>
        <p className="text-[12px] font-medium">{version.subject}</p>
      </div>

      <p className="text-[11px] text-muted-foreground mb-3">{version.preview}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {version.tags.map((tag, i) => (
          <span key={i} className="text-[10px] px-2 py-0.5 rounded-[20px] bg-secondary text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-1.5 mb-3">
        {scores.map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-24 capitalize">{key}</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${val}%`,
                  backgroundColor: val >= 70 ? '#1d9e75' : val >= 40 ? '#378add' : '#854f0b',
                }}
              />
            </div>
            <span className="text-[10px] w-6 text-right font-medium">{val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {predictions.map(([key, val]) => (
          <div key={key} className="bg-secondary rounded-md px-2 py-1.5 text-center">
            <p className="text-[9px] text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
            <p className="text-[12px] font-semibold">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailBodyCard({ body, recommended, t }: { body: EmailBodyVersion; recommended: boolean; t: T }) {
  return (
    <div className={`bg-card border rounded-lg p-4 ${recommended ? 'border-[#1a3a5c] border-2' : 'border-border'}`}>
      <p className="text-[11px] text-muted-foreground italic mb-2">
        <span className="font-medium not-italic">{t('ab_preheader')}: </span>{body.preheader}
      </p>
      <p className="text-[12px] text-muted-foreground mb-2">
        <span className="font-medium text-foreground">{t('ab_body_structure')}: </span>{body.body_html_structure}
      </p>
      <div className={`border-l-4 pl-3 mb-3 ${recommended ? 'border-[#1a3a5c]' : 'border-muted-foreground/30'}`}>
        <p className="text-[14px] font-medium">{body.hero_message}</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <div
          className="text-[11px] font-medium px-4 py-1.5 rounded-[20px]"
          style={recommended ? { backgroundColor: '#1a3a5c', color: '#fff' } : { backgroundColor: '#e0e0e0', color: '#333' }}
        >
          {body.cta_primary}
        </div>
        {body.cta_secondary && (
          <div className="text-[11px] font-medium px-4 py-1.5 rounded-[20px] border border-border text-foreground">
            {body.cta_secondary}
          </div>
        )}
      </div>
      {body.personalization_tokens.length > 0 && (
        <div className="mb-2">
          <p className="text-[10px] text-muted-foreground mb-1">{t('ab_tokens')}</p>
          <div className="flex flex-wrap gap-1">
            {body.personalization_tokens.map((tok, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-[20px] bg-ai-bg text-ai-foreground font-mono">
                {tok}
              </span>
            ))}
          </div>
        </div>
      )}
      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-[20px] bg-secondary text-muted-foreground">
        {t('ab_length')}: {body.recommended_length}
      </span>
    </div>
  );
}

export default function ABTestCard({ abTest, totalDelivered, campaignName, t }: ABTestCardProps) {
  const configItems = [
    { label: t('ab_muestra'), value: `${totalDelivered} ${t('ab_contactos')}` },
    { label: t('ab_split'), value: '50/50' },
    { label: t('ab_duracion'), value: t('ab_duracion_val') },
    { label: t('ab_metrica'), value: t('ab_metrica_val') },
    { label: t('ab_secundarias'), value: t('ab_secundarias_val') },
    { label: t('ab_confianza'), value: '95%' },
  ];

  const timeline = [
    { label: t('timeline_day0'), desc: t('timeline_day0_desc'), color: '#378add' },
    { label: t('timeline_4h'), desc: t('timeline_4h_desc'), color: '#378add' },
    { label: t('timeline_24h'), desc: t('timeline_24h_desc'), color: '#1d9e75' },
    { label: t('timeline_48h'), desc: t('timeline_48h_desc'), color: '#1d9e75' },
    { label: t('timeline_72h'), desc: t('timeline_72h_desc'), color: '#534AB7' },
  ];

  return (
    <div className="mx-4 mt-4 fade-in">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="mb-3">
          <h3 className="text-[13px] font-medium">{t('ab_test_title')}</h3>
          <p className="text-[11px] text-muted-foreground">{campaignName} · {totalDelivered.toLocaleString('es-CO')} {t('ab_entregados')}</p>
          <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-[20px] bg-secondary text-muted-foreground">
            {t('ab_variantes')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <VersionCard version={abTest.version_a} recommended={false} recommendedLabel={t('ab_recommended')} />
          <VersionCard version={abTest.version_b} recommended={true} recommendedLabel={t('ab_recommended')} />
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-md px-3 py-2.5 text-[11px]" style={{ backgroundColor: '#eaf3de', color: '#27500a' }}>
            <p className="font-medium mb-1">{t('ab_winner_label')} {abTest.winner} {t('ab_gana')}</p>
            <p>{abTest.reason}</p>
          </div>
          <div className="rounded-md px-3 py-2.5 text-[11px]" style={{ backgroundColor: '#faeeda', color: '#633806' }}>
            <p className="font-medium mb-1">{t('ab_riesgo')}</p>
            <p>{abTest.risk}</p>
          </div>
          <div className="rounded-md px-3 py-2.5 text-[11px]" style={{ backgroundColor: '#e6f1fb', color: '#0c447c' }}>
            <p className="font-medium mb-1">{t('ab_excluir')}</p>
            <p>{abTest.exclude_segments}</p>
          </div>
        </div>

        {/* Email body suggestion */}
        {abTest.email_body_suggestion && (
          <div className="mb-4">
            <p className="text-[13px] font-medium mb-2">{t('ab_body_title')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <EmailBodyCard body={abTest.email_body_suggestion.version_a} recommended={false} t={t} />
              <EmailBodyCard body={abTest.email_body_suggestion.version_b} recommended={true} t={t} />
            </div>
          </div>
        )}

        {/* Config */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          {configItems.map(c => (
            <div key={c.label} className="bg-secondary rounded-md px-2 py-1.5">
              <p className="text-[9px] text-muted-foreground">{c.label}</p>
              <p className="text-[11px] font-medium">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-border -translate-y-3" />
          {timeline.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center gap-1 z-10">
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: item.color, backgroundColor: item.color }} />
              <p className="text-[10px] font-medium">{item.label}</p>
              <p className="text-[9px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap mt-4">
          <button className="text-[11px] font-medium px-4 py-1.5 rounded-[20px] bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            {t('ab_configurar')}
          </button>
          <button className="text-[11px] font-medium px-3 py-1.5 rounded-[20px] border border-border text-foreground hover:bg-secondary transition-colors">
            {t('ab_variante_c')}
          </button>
          <button className="text-[11px] font-medium px-3 py-1.5 rounded-[20px] border border-border text-foreground hover:bg-secondary transition-colors">
            {t('ab_body_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
