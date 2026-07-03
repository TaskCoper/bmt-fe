'use client'

import { useTranslations } from 'next-intl'

import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Badge } from '@/shared/components/ui/badge'
import {
  CONSTRUCTION_TYPE_OPTIONS,
  type ConstructionType,
} from '../../constants/studio.constants'
import { useWizardStore } from '../../store/wizard.store'
import { StepSection } from '../step-section'

/** Step 1 — create the project: name, construction type, optional note. */
export function StepCreate() {
  const t = useTranslations('studio.create')
  const tType = useTranslations('studio.constructionType')
  const tCommon = useTranslations('common')

  const name = useWizardStore((s) => s.data.name)
  const note = useWizardStore((s) => s.data.note)
  const constructionType = useWizardStore((s) => s.data.constructionType)
  const patch = useWizardStore((s) => s.patch)

  return (
    <div className="space-y-8">
      <StepSection title={t('basics')}>
        <div className="space-y-2">
          <Label htmlFor="project-name">
            {t('nameLabel')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="project-name"
            value={name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder={t('namePlaceholder')}
            autoFocus
          />
        </div>
      </StepSection>

      <StepSection title={t('typeLabel')} description={t('typeHint')}>
        <div className="grid gap-3 sm:grid-cols-3">
          {CONSTRUCTION_TYPE_OPTIONS.map((opt) => {
            const selected = constructionType === opt.value
            const disabled = !opt.mvp
            return (
              <button
                key={opt.value}
                type="button"
                disabled={disabled}
                onClick={() =>
                  patch({ constructionType: opt.value as ConstructionType })
                }
                className={cn(
                  'relative rounded-lg border p-4 text-left transition-colors',
                  selected
                    ? 'border-primary ring-primary/30 bg-primary/5 ring-2'
                    : 'hover:border-primary/50',
                  disabled && 'cursor-not-allowed opacity-60',
                )}
              >
                <span className="block text-sm font-medium">
                  {tType(`${opt.value}.label`)}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs">
                  {tType(`${opt.value}.desc`)}
                </span>
                {disabled ? (
                  <Badge variant="secondary" className="mt-2">
                    {tCommon('comingSoon')}
                  </Badge>
                ) : null}
              </button>
            )
          })}
        </div>
      </StepSection>

      <StepSection title={t('noteLabel')}>
        <div className="space-y-2">
          <Textarea
            value={note}
            onChange={(e) => patch({ note: e.target.value })}
            placeholder={t('notePlaceholder')}
            rows={4}
          />
          <p className="text-muted-foreground text-xs">{t('noteHint')}</p>
        </div>
      </StepSection>
    </div>
  )
}
