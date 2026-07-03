'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import { formatDate } from '@/shared/utils';
import { MAX_REGENERATIONS } from '../../constants/studio.constants';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useWizardStore } from '../../store/wizard.store';
import { StepSection } from '../step-section';
import { FloorPlan } from '../floor-plan';
import { EstimateTabs } from '../estimate-tabs';
import { AreaSummary } from '../area-summary';
import { BudgetSummary } from '../budget-summary';
import { CostDonut } from '../cost-donut';

/** Step 4 — AI-generated result: drawing, estimate tabs, area, summary, donut. */
export function StepResult() {
  const t = useTranslations('studio.result');
  const locale = useLocale() as Locale;

  const result = useWizardStore((s) => s.result);
  const isGenerating = useWizardStore((s) => s.isGenerating);
  const generate = useWizardStore((s) => s.generate);
  const regenerate = useWizardStore((s) => s.regenerate);
  const regenCount = useWizardStore((s) => s.regenCount);
  const regenLeft = MAX_REGENERATIONS - regenCount;

  // Auto-run the mock generation the first time the user reaches this step.
  useEffect(() => {
    if (!result && !isGenerating) void generate();
  }, [result, isGenerating, generate]);

  if (isGenerating || !result) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
          {isGenerating ? (
            <Loader2 className="text-primary size-8 animate-spin" />
          ) : (
            <Sparkles className="text-primary size-8" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{t('generating')}</p>
          <p className="text-muted-foreground text-sm">{t('generatingHint')}</p>
        </div>
        {!isGenerating ? (
          <Button onClick={() => void generate()}>
            <Sparkles className="size-4" />
            {t('regenerate')}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Regenerate control — capped at MAX_REGENERATIONS per project */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {regenLeft > 0 ? (
          <span className="text-muted-foreground text-xs">
            {t('regenLeft', { count: regenLeft })}
          </span>
        ) : (
          <span className="text-destructive text-xs">
            {t('regenExhausted')}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => void regenerate()}
          disabled={regenLeft <= 0}
        >
          <RefreshCw className="size-4" />
          {t('regenerate')}
        </Button>
      </div>

      {/* 4A — 2D drawing + 4D area summary */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <StepSection title={t('drawingTitle')}>
          <FloorPlan />
        </StepSection>
        <StepSection title={t('areaTitle')}>
          <AreaSummary area={result.area} />
        </StepSection>
      </div>

      {/* 4B/4C — detailed estimate with tooltips */}
      <StepSection title={t('estimateTitle')} description={t('estimateHint')}>
        <EstimateTabs categories={result.categories} budget={result.budget} />
      </StepSection>

      {/* 4E — aggregate summary + donut */}
      <StepSection title={t('summaryTitle')}>
        <div className="grid gap-6 lg:grid-cols-2">
          <BudgetSummary budget={result.budget} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('structureTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CostDonut budget={result.budget} />
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground text-xs">
          {t('disclaimer')}{' '}
          {t('estimatedOn', {
            date: formatDate(result.generatedAt, locale),
          })}
        </p>
      </StepSection>
    </div>
  );
}
