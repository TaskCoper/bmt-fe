'use client'

import { Input, Label, RadioGroup, RadioGroupItem } from '@/shared/components/ui'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/shared/components/ui/input-group'
import { cn } from '@/shared/lib'
import { useTranslations } from 'next-intl'
import { Controller, useFormContext } from 'react-hook-form'
import { DESCRIPTION_MAX_LENGTH } from '../../hooks/use-create-project'
import { HouseType } from '../../types/project.types'
import AppartmentIcon from '../icons/appartment-icon'

export default function CreateProjectForm() {
  const { control } = useFormContext()
  const t = useTranslations('project')

  return (
    <div>
      <Controller
        name='name'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className='gap-1'>
            <FieldLabel htmlFor={field.name} className='gap-0.5'>
              {t('form.name')}
              <span className='text-destructive font-semibold'>*</span>
            </FieldLabel>

            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={t('form.namePlaceholder')}
              spellCheck={false}
              autoFocus
              autoComplete='off'
            />

            <div className='min-h-4'>
              {fieldState.invalid && <FieldError className='text-xs' errors={[fieldState.error]} />}
            </div>
          </Field>
        )}
      />

      <Controller
        name='houseType'
        control={control}
        render={({ field, fieldState }) => {
          const labelId = `${field.name}-label`

          return (
            <Field data-invalid={fieldState.invalid} className='gap-1'>
              <FieldLabel id={labelId} className='gap-0.5'>
                {t('form.houseType')}
                <span className='text-destructive font-semibold'>*</span>
              </FieldLabel>

              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-labelledby={labelId}
                aria-invalid={fieldState.invalid}
                className='grid gap-3 sm:grid-cols-3'
              >
                {Object.values(HouseType).map((option) => {
                  const isSelected = field.value === option
                  const optionLabel = t(`houseType.${option}`)

                  return (
                    <Label
                      key={option}
                      className={cn(
                        'bg-card hover:border-primary/40 hover:bg-accent/40 flex cursor-pointer flex-row items-center gap-0.5 rounded-lg border pr-2 shadow-sm transition-all',
                        'has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]',
                        'has-data-[state=checked]:border-primary/70 has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:shadow-primary/10 has-data-[state=checked]:shadow-md',
                        fieldState.invalid ? 'border-destructive' : 'border-border/70'
                      )}
                    >
                      <AppartmentIcon
                        aria-hidden='true'
                        className={cn(
                          'h-auto w-9 shrink-0 transition-colors',
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        )}
                        strokeColor='currentColor'
                        accentStrokeColor='currentColor'
                        {...(isSelected && {
                          bodyFill: 'color-mix(in oklch, currentColor 12%, transparent)',
                          roofFill: 'color-mix(in oklch, currentColor 28%, transparent)',
                          sideFill: 'color-mix(in oklch, currentColor 22%, transparent)',
                          windowFill: 'color-mix(in oklch, currentColor 30%, transparent)',
                          doorFill: 'color-mix(in oklch, currentColor 32%, transparent)',
                          shadowFill: 'color-mix(in oklch, currentColor 22%, transparent)'
                        })}
                      />

                      <p
                        className={cn(
                          'flex-1 text-sm font-medium transition-colors',
                          isSelected ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {optionLabel}
                      </p>

                      <RadioGroupItem value={option} aria-label={optionLabel} />
                    </Label>
                  )
                })}
              </RadioGroup>

              <div className='min-h-4'>
                {fieldState.invalid && <FieldError className='text-xs' errors={[fieldState.error]} />}
              </div>
            </Field>
          )
        }}
      />

      <Controller
        name='description'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className='gap-1'>
            <FieldLabel htmlFor={field.name}>{t('form.description')}</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id={field.name}
                placeholder={t('form.descriptionPlaceholder')}
                rows={6}
                className='min-h-24 resize-none wrap-break-word'
                aria-invalid={fieldState.invalid}
              />
              <InputGroupAddon align='block-end'>
                <InputGroupText className='text-xs tabular-nums'>
                  {t('form.charCount', { count: field.value.length, max: DESCRIPTION_MAX_LENGTH })}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>{t('form.descriptionHint')}</FieldDescription>
          </Field>
        )}
      />
    </div>
  )
}
