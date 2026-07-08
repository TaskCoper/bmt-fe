'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Check, ExternalLink } from 'lucide-react'

import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs'
import {
  PACKAGE_TIERS,
  projectStepPath,
  type PackageTier,
} from '../constants/studio.constants'
import { sectionTotal } from '../services/studio.service'
import { useCurrentProject, useWizardStore } from '../store/wizard.store'
import type { EstimateSection } from '../types/studio.types'

function detailPath(projectId: string, section: string, tier: string) {
  return `${projectStepPath(projectId, 'result')}/estimate/${section}/${tier}`
}

/** A single "view detail" link that opens the itemised breakdown in a new tab. */
function DetailLink({
  projectId,
  section,
  tier,
  label,
}: {
  projectId: string
  section: string
  tier: string
  label: string
}) {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link
        href={detailPath(projectId, section, tier)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink className="size-3.5" />
        {label}
      </Link>
    </Button>
  )
}

/**
 * Step 4B — the estimate table. Rough is a single fixed line; finishing &
 * interior expose their package tiers as selectable rows that recompute the
 * totals (via the store) instantly.
 */
export function EstimateTable({
  projectId,
  sections,
}: {
  projectId: string
  sections: EstimateSection[]
}) {
  const t = useTranslations('studio.estimate')
  const tPkg = useTranslations('studio.package')
  const locale = useLocale() as Locale
  const project = useCurrentProject()
  const setSelection = useWizardStore((s) => s.setSelection)

  const selection = project?.selection
  const rough = sections.find((s) => s.key === 'rough')
  const finishing = sections.find((s) => s.key === 'finishing')
  const interior = sections.find((s) => s.key === 'interior')

  const renderTierRows = (
    section: EstimateSection,
    key: 'finishing' | 'interior',
  ) => (
    <div className="space-y-2">
      {PACKAGE_TIERS.map((tier: PackageTier) => {
        const selected = selection?.[key] === tier
        return (
          <div
            key={tier}
            className={cn(
              'glass-card flex flex-wrap items-center gap-3 p-4',
              selected && 'glass-selected',
            )}
          >
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setSelection({ [key]: tier })}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-glass-border bg-background/50',
                )}
              >
                {selected ? <Check className="size-3" /> : null}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">
                  {tPkg(`${tier}.name`)}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {tPkg(`${tier}.desc`)}
                </span>
              </span>
            </button>
            <span className="text-sm font-semibold tracking-tight tabular-nums">
              {formatCurrency(sectionTotal(section, tier), locale)}
            </span>
            <DetailLink
              projectId={projectId}
              section={key}
              tier={tier}
              label={t('viewDetail')}
            />
          </div>
        )
      })}
    </div>
  )

  return (
    <Tabs defaultValue="rough">
      <TabsList>
        <TabsTrigger value="rough">{t('tabRough')}</TabsTrigger>
        <TabsTrigger value="finishing">{t('tabFinishing')}</TabsTrigger>
        <TabsTrigger value="interior">{t('tabInterior')}</TabsTrigger>
      </TabsList>

      <TabsContent value="rough" className="pt-4">
        {rough ? (
          <div className="border-glass-border bg-background/40 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 backdrop-blur-sm">
            <span className="text-sm font-medium">{t('roughSingle')}</span>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold tracking-tight tabular-nums">
                {formatCurrency(sectionTotal(rough, 'basic'), locale)}
              </span>
              <DetailLink
                projectId={projectId}
                section="rough"
                tier="single"
                label={t('viewDetail')}
              />
            </div>
          </div>
        ) : null}
      </TabsContent>

      <TabsContent value="finishing" className="pt-4">
        {finishing ? renderTierRows(finishing, 'finishing') : null}
      </TabsContent>

      <TabsContent value="interior" className="pt-4">
        {interior ? renderTierRows(interior, 'interior') : null}
      </TabsContent>
    </Tabs>
  )
}
