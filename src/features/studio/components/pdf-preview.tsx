'use client'

import { useLocale, useTranslations } from 'next-intl'

import type { Locale } from '@/i18n/routing'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/utils'
import { breakdownFor } from '../services/studio.service'
import type { ProjectSnapshot } from '../types/studio.types'

/** A single mock "A4" page in the preview stack. */
function Page({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const t = useTranslations('studio.export')
  return (
    <div className="border-glass-border bg-card mx-auto aspect-[1/1.414] w-full max-w-sm overflow-hidden rounded-xl border shadow-[0_1px_2px_oklch(0.3_0.03_60_/_0.06),0_10px_30px_-12px_oklch(0.3_0.03_60_/_0.2)]">
      <div className="flex h-full flex-col p-5">
        <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
          {label}
        </p>
        <div className="mt-3 flex-1 text-xs">{children}</div>
        <div className="text-muted-foreground/70 border-glass-border mt-2 border-t pt-2 text-[9px]">
          BMT Decor · {t('footerNote')}
        </div>
      </div>
    </div>
  )
}

/** Paginated PDF preview that reacts to the section checklist. */
export function PdfPreview({ project }: { project: ProjectSnapshot }) {
  const t = useTranslations('studio.export')
  const tp = useTranslations('studio.export.page')
  const locale = useLocale() as Locale
  const { data, result, exportOptions: opt } = project

  const total = result ? breakdownFor(result, project.selection).total : 0

  return (
    <div
      className={cn(
        'border-glass-border bg-background/40 max-h-[70vh] space-y-4 overflow-y-auto rounded-xl border p-4 backdrop-blur-sm',
      )}
    >
      {opt.coverPage ? (
        <Page label={tp('cover')}>
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <div className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-lg text-lg font-bold">
              BMT
            </div>
            <p className="text-sm font-semibold">
              {data.name || t('untitled')}
            </p>
          </div>
        </Page>
      ) : null}

      {opt.projectInfo ? (
        <Page label={tp('info')}>
          <ul className="space-y-1">
            <li>{data.address}</li>
            <li className="text-muted-foreground">{data.area} m²</li>
          </ul>
        </Page>
      ) : null}

      {opt.drawings ? (
        <Page label={tp('drawings')}>
          <div className="border-glass-border bg-background/40 grid h-24 place-items-center rounded-lg border">
            2D
          </div>
        </Page>
      ) : null}

      {opt.estimate ? (
        <Page label={tp('estimate')}>
          <div className="flex items-center justify-between">
            <span>{t('previewTitle')}</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(total, locale)}
            </span>
          </div>
        </Page>
      ) : null}

      {opt.renders ? (
        <Page label={tp('renders')}>
          <div className="grid grid-cols-2 gap-1">
            {(result?.renders ?? [])
              .filter((r) => r.favorite)
              .slice(0, 4)
              .map((r) => (
                <div
                  key={r.id}
                  className="aspect-[4/3] rounded"
                  style={{
                    background: `linear-gradient(135deg, hsl(${r.hue} 70% 55%), hsl(${(r.hue + 40) % 360} 65% 35%))`,
                  }}
                />
              ))}
          </div>
        </Page>
      ) : null}
    </div>
  )
}
