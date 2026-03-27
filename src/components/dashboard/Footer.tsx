import type { T } from '@/lib/translations';

interface FooterProps {
  t: T;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="mt-8 bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between flex-wrap gap-2">
      <span className="text-[11px] opacity-80">{t('footer_left')}</span>
      <span className="text-[12px] font-medium">{t('footer_team')}</span>
      <span className="text-[11px] opacity-80">{t('footer_right')}</span>
    </footer>
  );
}
