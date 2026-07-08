'use client'

import { useRouter } from '@/i18n/navigation'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CONSTRUCTION_TYPE_OPTIONS, projectStepPath, type ConstructionType } from '../constants/studio.constants'
import { useWizardStore } from '../store/wizard.store'
import { StepSection } from './step-section'

/** Step 1 — create the project, then route into its requirements step. */
export function CreateProjectForm() {
  const t = useTranslations('studio.create')
  const tType = useTranslations('studio.constructionType')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const createProject = useWizardStore((s) => s.createProject)

  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [type, setType] = useState<ConstructionType>('apartment')

  const canSubmit = name.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    const id = createProject({
      name: name.trim(),
      constructionType: type,
      note
    })
    router.push(projectStepPath(id, 'requirements'))
  }

  return (
    <div className='space-y-8'>
      <StepSection title={t('basics')}>
        <div className='space-y-2'>
          <Label htmlFor='project-name'>
            {t('nameLabel')} <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='project-name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            autoFocus
          />
        </div>
      </StepSection>

      <StepSection title={t('typeLabel')} description={t('typeHint')}>
        <div className='grid gap-3 sm:grid-cols-3'>
          {CONSTRUCTION_TYPE_OPTIONS.map((opt) => {
            const selected = type === opt.value
            const disabled = !opt.mvp
            return (
              <button
                key={opt.value}
                type='button'
                disabled={disabled}
                onClick={() => setType(opt.value)}
                className={cn(
                  'glass-card p-4 text-left',
                  selected && 'glass-selected',
                  disabled &&
                    'cursor-not-allowed opacity-55 hover:translate-y-0 hover:shadow-[inset_0_1px_0_0_var(--glass-hairline),var(--glass-shadow-sm)]'
                )}
              >
                <span className='block text-sm font-medium'>{tType(`${opt.value}.label`)}</span>
                <span className='text-muted-foreground mt-1 block text-xs'>{tType(`${opt.value}.desc`)}</span>
                {disabled ? (
                  <Badge variant='secondary' className='mt-2'>
                    {tCommon('comingSoon')}
                  </Badge>
                ) : null}
              </button>
            )
          })}
        </div>
      </StepSection>

      <StepSection title={t('noteLabel')}>
        <div className='space-y-2'>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('notePlaceholder')}
            rows={4}
          />
          <p className='text-muted-foreground text-xs'>{t('noteHint')}</p>
        </div>
      </StepSection>

      <div className='border-border/50 flex justify-end border-t pt-6'>
        <Button
          size='lg'
          onClick={submit}
          disabled={!canSubmit}
          className='shadow-[0_8px_24px_-8px_oklch(0.77_0.155_65_/_0.6)]'
        >
          {t('submit')}
          <ArrowRight className='size-4' />
        </Button>
      </div>
    </div>
  )
}
