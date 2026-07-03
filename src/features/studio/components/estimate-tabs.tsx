'use client';

import { useTranslations, useLocale } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import { formatCurrency, formatNumber } from '@/shared/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Progress } from '@/shared/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import type { BudgetBreakdown, EstimateCategory } from '../types/studio.types';
import type { EstimateCategoryId } from '../constants/studio.constants';

function ItemTooltip({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: { material: string; method: string; note: string };
}) {
  const t = useTranslations('studio.estimate');
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="bg-popover text-popover-foreground max-w-xs border p-3 shadow-md">
        <dl className="space-y-1.5 text-xs">
          <div>
            <dt className="text-muted-foreground">{t('tip.material')}</dt>
            <dd className="font-medium">{detail.material}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('tip.method')}</dt>
            <dd className="font-medium">{detail.method}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('tip.note')}</dt>
            <dd className="font-medium">{detail.note}</dd>
          </div>
        </dl>
      </TooltipContent>
    </Tooltip>
  );
}

/** 3-tab detailed estimate (rough / finishing / interior) with row tooltips. */
export function EstimateTabs({
  categories,
  budget,
}: {
  categories: EstimateCategory[];
  budget: BudgetBreakdown;
}) {
  const t = useTranslations('studio.estimate');
  // Estimate item + unit keys are built dynamically by the service, so resolve
  // them through an untyped translator (next-intl's keys are otherwise static).
  const tItems = useTranslations('studio.items') as unknown as (
    key: string,
  ) => string;
  const tUnit = useTranslations('studio.unit') as unknown as (
    key: string,
  ) => string;
  const tb = useTranslations('studio.budget');
  const locale = useLocale() as Locale;

  const budgetByCat: Record<EstimateCategoryId, number> = {
    rough: budget.rough,
    finishing: budget.finishing,
    interior: budget.interior,
  };

  return (
    <Tabs defaultValue={categories[0]?.id ?? 'rough'}>
      <TabsList>
        {categories.map((cat) => (
          <TabsTrigger key={cat.id} value={cat.id}>
            {tb(`portion.${cat.id}`)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TooltipProvider delayDuration={100}>
        {categories.map((cat) => {
          const target = budgetByCat[cat.id] || 1;
          const pct = Math.min(100, Math.round((cat.total / target) * 100));
          return (
            <TabsContent key={cat.id} value={cat.id} className="space-y-4">
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('col.item')}</TableHead>
                      <TableHead className="text-right">
                        {t('col.quantity')}
                      </TableHead>
                      <TableHead className="text-right">
                        {t('col.unitPrice')}
                      </TableHead>
                      <TableHead className="text-right">
                        {t('col.amount')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cat.items.map((item) => (
                      <ItemTooltip
                        key={item.name}
                        detail={{
                          material: tItems(item.material),
                          method: tItems(item.method),
                          note: tItems(item.note),
                        }}
                      >
                        <TableRow className="hover:bg-muted/60 cursor-help">
                          <TableCell className="font-medium">
                            {tItems(item.name)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatNumber(item.quantity, locale)}{' '}
                            {tUnit(item.unit)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-right tabular-nums">
                            {formatCurrency(item.unitPrice, locale)}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(item.amount, locale)}
                          </TableCell>
                        </TableRow>
                      </ItemTooltip>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('vsBudget')}</span>
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(cat.total, locale)}
                  </span>
                </div>
                <Progress value={pct} />
                <p className="text-muted-foreground text-right text-xs">
                  {t('budgetUsage', { pct })}
                </p>
              </div>
            </TabsContent>
          );
        })}
      </TooltipProvider>
    </Tabs>
  );
}
