'use client'

import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { FileDown, Mail, QrCode } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Button } from '@/shared/components/ui/button'
import { EXPORT_LANGUAGES } from '../../constants/studio.constants'
import { useWizardStore } from '../../store/wizard.store'
import type { ExportOptions } from '../../types/studio.types'
import { StepSection } from '../step-section'
import { ShareLinkDialog } from '../share-link-dialog'

const SECTION_KEYS = [
  'coverPage',
  'projectInfo',
  'drawings',
  'estimate',
  'summary',
  'renders',
] as const satisfies ReadonlyArray<keyof ExportOptions>

export function StepExport() {
  const t = useTranslations('studio.export')

  const options = useWizardStore((s) => s.exportOptions)
  const setExportOption = useWizardStore((s) => s.setExportOption)
  const projectName = useWizardStore((s) => s.data.name)

  return (
    <div className="space-y-8">
      <StepSection title={t('contentTitle')} description={t('contentHint')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTION_KEYS.map((key) => (
            <label
              key={key}
              className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3"
            >
              <Checkbox
                checked={options[key] as boolean}
                onCheckedChange={(v) => setExportOption(key, Boolean(v))}
              />
              <span className="text-sm font-medium">{t(`section.${key}`)}</span>
            </label>
          ))}
        </div>
      </StepSection>

      <StepSection title={t('languageTitle')}>
        <div className="bg-muted inline-flex gap-1 rounded-lg p-1">
          {EXPORT_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setExportOption('language', lang)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                options.language === lang
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(`language.${lang}`)}
            </button>
          ))}
        </div>
      </StepSection>

      <StepSection title={t('exportTitle')}>
        <div className="bg-muted/30 flex flex-col items-start gap-4 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{projectName || t('untitled')}</p>
            <p className="text-muted-foreground text-sm">{t('readyHint')}</p>
          </div>
          <Button size="lg" onClick={() => toast.success(t('exportSuccess'))}>
            <FileDown className="size-4" />
            {t('exportButton')}
          </Button>
        </div>
      </StepSection>

      <StepSection title={t('shareTitle')} description={t('shareHint')}>
        <Label className="sr-only">{t('shareTitle')}</Label>
        <div className="flex flex-wrap gap-3">
          <ShareLinkDialog projectName={projectName} />
          <Button
            variant="outline"
            onClick={() => toast.success(t('emailSent'))}
          >
            <Mail className="size-4" />
            {t('shareEmail')}
          </Button>
          <Button variant="outline" onClick={() => toast.info(t('qrShown'))}>
            <QrCode className="size-4" />
            {t('shareQr')}
          </Button>
        </div>
      </StepSection>
    </div>
  )
}
