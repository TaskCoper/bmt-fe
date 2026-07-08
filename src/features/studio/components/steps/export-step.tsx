'use client'

import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { FileDown } from 'lucide-react'

import { useRouter } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { EXPORT_LANGUAGES } from '../../constants/studio.constants'
import { useCurrentProject, useWizardStore } from '../../store/wizard.store'
import type { ExportOptions } from '../../types/studio.types'
import { PdfPreview } from '../pdf-preview'
import { ShareModal } from '../share-modal'
import { StepFooter } from '../step-footer'
import { StepSection } from '../step-section'

const SECTION_KEYS = [
  'coverPage',
  'projectInfo',
  'drawings',
  'estimate',
  'summary',
  'renders'
] as const satisfies ReadonlyArray<keyof ExportOptions>

/** Step 6 — pick PDF sections, preview, export and share. */
export function ExportStep({ projectId }: { projectId: string }) {
  const t = useTranslations('studio.export')
  const tNav = useTranslations('studio.nav')
  const router = useRouter()

  const project = useCurrentProject()
  const setExportOption = useWizardStore((s) => s.setExportOption)

  if (!project) return null
  const options = project.exportOptions

  return (
    <div className='space-y-8'>
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Checklist + language */}
        <div className='space-y-6'>
          <StepSection title={t('contentTitle')} description={t('contentHint')}>
            <div className='space-y-2'>
              {SECTION_KEYS.map((key) => (
                <label
                  key={key}
                  className={cn(
                    'glass-card flex cursor-pointer items-center gap-3 p-3',
                    options[key] && 'glass-selected'
                  )}
                >
                  <Checkbox
                    checked={options[key] as boolean}
                    onCheckedChange={(v) => setExportOption(key, Boolean(v))}
                  />
                  <span className='text-sm font-medium tracking-tight'>{t(`section.${key}`)}</span>
                </label>
              ))}
            </div>
          </StepSection>

          <StepSection title={t('languageTitle')}>
            <div className='glass-inset inline-flex gap-1 rounded-xl p-1'>
              {EXPORT_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type='button'
                  onClick={() => setExportOption('language', lang)}
                  className={cn(
                    'rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-soft)]',
                    options.language === lang
                      ? 'bg-background/90 text-foreground border-glass-border border shadow-sm backdrop-blur'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t(`language.${lang}`)}
                </button>
              ))}
            </div>
            <p className='text-muted-foreground mt-2 text-xs'>{t('currencyNote')}</p>
          </StepSection>

          <div className='flex flex-wrap gap-3'>
            <Button onClick={() => toast.success(t('exportSuccess'))}>
              <FileDown className='size-4' />
              {t('exportButton')}
            </Button>
            <ShareModal token={projectId} />
          </div>
        </div>

        {/* Live preview */}
        <StepSection title={t('previewTitle')}>
          <PdfPreview project={project} />
        </StepSection>
      </div>

      <StepFooter
        projectId={projectId}
        step='export'
        nextLabel={tNav('finish')}
        onNext={() => router.push(ROUTES.PROJECTS)}
      />
    </div>
  )
}
