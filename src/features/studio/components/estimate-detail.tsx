'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'

import type { Locale } from '@/i18n/routing'
import { formatCurrency } from '@/shared/utils'
import { AmbientAura } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import type { PackageTier } from '../constants/studio.constants'
import { breakdownFor } from '../services/studio.service'
import { useCurrentProject } from '../store/wizard.store'
import type { EstimateItem } from '../types/studio.types'
import { BudgetProgressBar } from './budget-progress-bar'

/** Standalone (new-tab) itemised breakdown for one estimate section + tier. */
export function EstimateDetail({
  section,
  tier,
}: {
  section: string
  tier: string
}) {
  const t = useTranslations('studio.detail')
  // Item keys are built dynamically (`section.item.field`); the typed translator
  // can't verify arbitrary strings, so use a loose signature here.
  const tItems = useTranslations('studio.items') as unknown as (
    key: string,
  ) => string
  const tUnit = useTranslations('studio.unit')
  const tPortion = useTranslations('studio.budget.portion')
  const tPkg = useTranslations('studio.package')
  const locale = useLocale() as Locale
  const project = useCurrentProject()
  const [selected, setSelected] = useState<EstimateItem | null>(null)

  const result = project?.result
  const sectionData = result?.sections.find((s) => s.key === section)
  const tierKey = section === 'rough' ? 'single' : tier
  const tierData = sectionData?.tiers[tierKey as PackageTier | 'single']

  if (!project || !result || !tierData) {
    return (
      <div className="relative min-h-screen">
        <AmbientAura />
        <div className="relative mx-auto max-w-4xl p-6">
          <div className="glass-panel-strong text-muted-foreground p-10 text-center text-sm">
            {t('subtitle')}
          </div>
        </div>
      </div>
    )
  }

  const sectionLabel = tPortion(section as 'rough' | 'finishing' | 'interior')
  const tierLabel =
    section === 'rough'
      ? sectionLabel
      : tPkg(`${tier}.name` as `${PackageTier}.name`)

  const breakdown = breakdownFor(result, project.selection)

  return (
    <div className="relative min-h-screen">
      <AmbientAura />
      <div className="relative mx-auto max-w-4xl p-6">
        <div className="glass-panel-strong space-y-6 p-6 sm:p-8">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              {t('heading', { section: sectionLabel, tier: tierLabel })}
            </h1>
            <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
          </header>

          <BudgetProgressBar
            total={breakdown.total}
            target={project.data.budget}
          />

          <div className="border-glass-border bg-background/40 overflow-hidden rounded-xl border backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-glass-border bg-background/50 backdrop-blur hover:bg-transparent">
                  <TableHead>{t('colItem')}</TableHead>
                  <TableHead className="w-28">{t('colQuantity')}</TableHead>
                  <TableHead>{t('colMaterial')}</TableHead>
                  <TableHead className="w-24 text-right">
                    {t('colDetail')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tierData.items.map((item) => (
                  <TableRow
                    key={item.name}
                    className="border-glass-border hover:bg-background/40"
                  >
                    <TableCell className="font-medium">
                      {tItems(item.name)}
                    </TableCell>
                    <TableCell className="text-muted-foreground tracking-tight tabular-nums">
                      {item.quantity}{' '}
                      {tUnit(item.unit as 'm2' | 'm3' | 'kg' | 'set')}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {tItems(item.material)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(item)}
                      >
                        {t('open')}
                        <ChevronRight className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="text-muted-foreground text-right text-sm tracking-tight tabular-nums">
            {formatCurrency(tierData.total, locale)} ·{' '}
            {formatCurrency(breakdown.total, locale)}
          </p>
        </div>
      </div>

      {/* Material detail drawer */}
      <Sheet
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <SheetContent className="w-full sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{tItems(selected.name)}</SheetTitle>
                <SheetDescription>{t('drawerTitle')}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    {t('material')}
                  </p>
                  <p>{tItems(selected.material)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    {t('alternatives')}
                  </p>
                  <ul className="list-disc space-y-1 pl-4">
                    {selected.alternatives.map((alt) => (
                      <li key={alt}>{tItems(alt)}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    {t('method')}
                  </p>
                  <p>{tItems(selected.method)}</p>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
