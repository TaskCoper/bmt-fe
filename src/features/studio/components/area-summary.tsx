'use client';

import { useTranslations, useLocale } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import { formatNumber } from '@/shared/utils';
import type { AreaSummary as AreaSummaryData } from '../types/studio.types';

/** Construction-area summary table (step 4D). */
export function AreaSummary({ area }: { area: AreaSummaryData }) {
  const t = useTranslations('studio.area');
  const locale = useLocale() as Locale;
  const n = (v: number) => formatNumber(v, locale);

  const rows: Array<{
    key: 'land' | 'ground' | 'totalFloor' | 'usable' | 'floors' | 'height';
    value: string;
  }> = [
    { key: 'land', value: `${n(area.landArea)} m²` },
    { key: 'ground', value: `${n(area.groundFloorArea)} m²` },
    { key: 'totalFloor', value: `${n(area.totalFloorArea)} m²` },
    { key: 'usable', value: `${n(area.usableArea)} m²` },
    { key: 'floors', value: t('floorsValue', { count: area.floors }) },
    { key: 'height', value: `${n(area.estimatedHeight)} m` },
  ];

  return (
    <dl className="divide-y rounded-lg border text-sm">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between px-4 py-2.5"
        >
          <dt className="text-muted-foreground">{t(row.key)}</dt>
          <dd className="font-medium tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
