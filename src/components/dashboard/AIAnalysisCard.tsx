import { Sparkles, Loader2 } from 'lucide-react';
import type { ClaudeResponse } from '@/types/dashboard';
import type { T } from '@/lib/translations';

interface AIAnalysisCardProps {
  analysis: ClaudeResponse | null;
  loading: boolean;
  error: string;
  onAnalyze: () => void;
  onCreateABTest: () => void;
  t: T;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: value >= 70 ? '#1d9e75' : value >= 40 ? '#378add' : '#854f0b',
          }}
        />
      </div>
      <span className="text-[11px] font-medium w-8 text-right">{value}</span>
    </div>
  );
}

function TopSubjectSkeleton() {
  return (
    <div className="bg-secondary rounded-lg p-3 animate-pulse">
      <div className="h-3 bg-muted-foreground/20 rounded w-3/4 mb-2" />
      <div className="h-2 bg-muted-foreground/20 rounded w-1/4 mb-2" />
      <div className="h-1.5 bg-muted-foreground/20 rounded-full w-full mb-2" />
      <div className="h-2 bg-muted-foreground/20 rounded w-2/3" />
    </div>
  );
}

export default function AIAnalysisCard({ analysis, loading, error, onAnalyze, onCreateABTest, t }: AIAnalysisCardProps) {
  return (
    <div className="mx-4 mt-4 border-[1.5px] border-accent/30 rounded-lg p-4" style={{ borderColor: '#b5d4f4' }}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-[20px] bg-ai-bg text-ai-foreground">
            <Sparkles size={12} />
            {t('ai_badge')}
          </span>
        </div>
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-4 py-1.5 rounded-[20px] bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {loading ? t('analyzing') : t('analyze_btn')}
        </button>
      </div>

      {error && (
        <div className="text-[11px] text-destructive bg-destructive/10 px-3 py-2 rounded-sm mb-3">{error}</div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-[12px]">{t('ai_analyzing')}</span>
        </div>
      )}

      {!analysis && !loading && (
        <div className="py-6 text-center">
          <p className="text-[12px] text-muted-foreground">{t('ai_placeholder')}</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="fade-in space-y-4">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-1">{t('ai_subject')}</p>
            <p className="text-[13px] font-medium">{analysis.subject}</p>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-1">{t('ai_preview')}</p>
            <p className="text-[12px] text-muted-foreground">{analysis.preview}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {analysis.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium px-2 py-0.5 rounded-[20px]"
                style={{ backgroundColor: tag.color, color: tag.text }}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            <ScoreBar label={t('ai_personalizacion')} value={analysis.scores.personalizacion} />
            <ScoreBar label={t('ai_relevancia')} value={analysis.scores.relevancia_nicho} />
            <ScoreBar label={t('ai_timing')} value={analysis.scores.timing_optimo} />
            <ScoreBar label={t('ai_recompra')} value={analysis.scores.potencial_recompra} />
            <ScoreBar label={t('ai_asunto_score')} value={analysis.scores.asunto_score} />
          </div>

          {/* Top 3 subjects */}
          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-2">{t('top_subjects_title')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {analysis.top_subjects && analysis.top_subjects.length > 0
                ? analysis.top_subjects.slice(0, 3).map((s, i) => (
                    <div key={i} className="bg-secondary rounded-lg p-3 border border-border">
                      <p
                        className="text-[13px] font-medium mb-1.5 overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={s.subject}
                      >
                        {s.subject}
                      </p>
                      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-[20px] mb-1.5" style={{ backgroundColor: '#eaf3de', color: '#27500a' }}>
                        {s.open_rate}
                      </span>
                      <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.impact_score}%`,
                            backgroundColor: s.impact_score >= 70 ? '#1d9e75' : s.impact_score >= 40 ? '#378add' : '#854f0b',
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">{s.why}</p>
                    </div>
                  ))
                : [0, 1, 2].map(i => <TopSubjectSkeleton key={i} />)
              }
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground italic">{analysis.hint}</p>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onCreateABTest}
              className="text-[11px] font-medium px-3 py-1.5 rounded-[20px] bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {t('btn_ab_test')}
            </button>
            <button className="text-[11px] font-medium px-3 py-1.5 rounded-[20px] border border-border text-foreground hover:bg-secondary transition-colors">
              {t('btn_optimize')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
