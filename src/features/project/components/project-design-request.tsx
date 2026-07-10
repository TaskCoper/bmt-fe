'use client'

import { useRouter } from '@/i18n/navigation'
import { ComboboxField } from '@/shared/components/common/combobox-field'
import { RadioCardOption } from '@/shared/components/common/radio-card-option'
import { Button, Card, RadioGroup, Slider } from '@/shared/components/ui'
import { Field, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { useGetProvinces } from '@/shared/hooks/use-get-provinces'
import { useGetWards } from '@/shared/hooks/use-get-wards'
import { cn } from '@/shared/lib/utils'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, FormProvider, useFieldArray, type SubmitHandler } from 'react-hook-form'
import { useDesignRequest } from '../hooks/use-design-request'
import {
  DESIGN_REQUEST_BUDGET_DEFAULT,
  DESIGN_REQUEST_BUDGET_MAX,
  DESIGN_REQUEST_BUDGET_MIN,
  DESIGN_REQUEST_BUDGET_STEP,
  type DesignRequestFormValues
} from '../schemas/project.schema'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'
import { useFlowNavigation } from './project-flow-layout'
import { COLOR_PRESETS, Direction, FloorLayout, FloorLighting, HouseStyle, RoofStyle } from '../types/project.types'
import FloorCardsForm from './floor-cards-form'
import DirectionCompassIcon from './icons/direction-compass-icon'
import ThaiRoofIcon from './icons/thai-roof-icon'
import TraditionalRoofHouseIcon from './icons/traditional-roof-house-icon'
import TumPartIcon from './icons/tum-part-icon'

const HOUSE_STYLE_OPTIONS = [HouseStyle.Roof, HouseStyle.Modern, HouseStyle.Neoclassical] as const
const ROOF_STYLE_OPTIONS = [RoofStyle.Thai, RoofStyle.Japanese, RoofStyle.Traditional, RoofStyle.Other] as const
const DIRECTION_OPTIONS = [Direction.East, Direction.West, Direction.South, Direction.North] as const

const BUDGET_VND = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })

function formatBudget(value: number): string {
  return `${BUDGET_VND.format(value)} ₫`
}

function formatBudgetInput(value: number): string {
  return Number.isFinite(value) ? BUDGET_VND.format(value) : ''
}

function parseBudgetInput(value: string): number {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(digits) : Number.NaN
}

function clampBudget(value: number): number {
  if (!Number.isFinite(value)) return DESIGN_REQUEST_BUDGET_DEFAULT
  return Math.min(Math.max(value, DESIGN_REQUEST_BUDGET_MIN), DESIGN_REQUEST_BUDGET_MAX)
}

export default function ProjectDesignRequest({ slug }: { slug: string }) {
  const t = useTranslations('project.form')
  const tc = useTranslations('common')

  const projects = useProjectStore((s) => s.projects)
  const router = useRouter()
  const { methods } = useDesignRequest()

  const updateProject = useProjectStore((s) => s.updateProject)
  const flowNav = useFlowNavigation()

  useSetProjectFlow(slug, 'design-request')

  const project = projects[slug]
  const draft = project?.designRequest

  const { setValue, watch, reset, control, handleSubmit, getValues } = methods

  useEffect(() => {
    flowNav?.registerBeforeNavigate(() => {
      const { designRequest } = getValues()
      updateProject({ slug, patch: { designRequest } })
    })
    return () => flowNav?.registerBeforeNavigate(null)
  }, [flowNav, getValues, updateProject, slug])

  const cityCodeForm = watch('designRequest.cityCode')
  const styleForm = watch('designRequest.style')

  const { provinces, isLoadingProvinces } = useGetProvinces()
  const { wards, isLoadingWards } = useGetWards(cityCodeForm ?? -1)

  const {
    fields: floorFields,
    append: appendFloor,
    insert: insertFloor,
    remove: removeFloor
  } = useFieldArray({
    control,
    name: 'designRequest.floors'
  })

  const onSubmit: SubmitHandler<DesignRequestFormValues> = (body) => {
    updateProject({ slug, patch: { designRequest: body.designRequest } })
    window.scrollTo({ top: 0, behavior: 'instant' })
    router.push(project?.nextUrl ?? `/dashboard/projects/${slug}/spaces`)
  }

  useEffect(() => {
    if (!project || provinces.length === 0) return

    const matchedProvince = provinces.find((p) => p.name === draft?.city)
    const cityCode = matchedProvince?.code ?? draft?.cityCode ?? -1

    reset({
      designRequest: {
        style: draft?.style ?? HouseStyle.Modern,
        roofStyle: draft?.roofStyle,
        hasTum: draft?.hasTum ?? false,
        budgetAmount: draft?.budgetAmount ?? DESIGN_REQUEST_BUDGET_DEFAULT,
        direction: draft?.direction ?? Direction.South,
        address: draft?.address ?? '',
        city: draft?.city ?? '',
        cityCode,
        ward: draft?.ward ?? '',
        wardCode: -1,
        floors: draft?.floors?.length
          ? draft.floors
          : [{ area: 0, layout: FloorLayout.Open, lighting: FloorLighting.Natural, color: COLOR_PRESETS[0] }]
      }
    })

    if (cityCode !== -1) {
      setValue('designRequest.cityCode', cityCode)
    }
  }, [project, draft, provinces, reset, setValue])

  useEffect(() => {
    if (!draft || wards.length === 0 || cityCodeForm === -1) return

    const matchedWard = wards.find((w) => w.name === draft.ward)
    if (matchedWard) {
      setValue('designRequest.wardCode', matchedWard.code)
    }
  }, [wards, draft, cityCodeForm, setValue])

  if (!project) {
    return <p>{t('projectNotFound')}</p>
  }

  const showRoofStyle = styleForm === HouseStyle.Roof
  const showTum = styleForm === HouseStyle.Modern || styleForm === HouseStyle.Neoclassical

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
        <Controller
          name='designRequest.budgetAmount'
          control={control}
          render={({ field, fieldState }) => {
            const inputValue = formatBudgetInput(field.value)
            const sliderValue = clampBudget(field.value ?? DESIGN_REQUEST_BUDGET_DEFAULT)

            return (
              <Field data-invalid={fieldState.invalid} className='gap-2'>
                {/* <FieldLabel
                  htmlFor={field.name}
                  className='bg-primary/10 p-4 rounded-lg border border-primary border-dashed font-normal gap-4 items-start'
                >
                  <CoinsIcon className='text-primary size-10' />
                  <div className='min-w-0'>
                    <p className='font-semibold text-base'>Ngân sách dự kiến</p>
                    <p className='text-sm leading-4 '>
                      Kéo thanh trượt hoặc nhập trực tiếp mức ngân sách tổng bạn dự trù cho công trình. Ở bước 4, hệ
                      thống sẽ so sánh dự toán với con số này khi bạn chọn các gói vật liệu khác nhau.
                    </p>
                  </div>
                </FieldLabel> */}

                <div className='flex items-center gap-3'>
                  <Input
                    id={field.name}
                    type='text'
                    inputMode='numeric'
                    placeholder='2.000.000.000'
                    pattern='[0-9.]*'
                    value={inputValue}
                    onChange={(e) => field.onChange(parseBudgetInput(e.target.value))}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    aria-valuemin={DESIGN_REQUEST_BUDGET_MIN}
                    aria-valuemax={DESIGN_REQUEST_BUDGET_MAX}
                    aria-valuenow={Number.isFinite(field.value) ? field.value : undefined}
                    className='font-mono h-auto resize-none rounded-none border-none px-0 text-7xl! font-bold shadow-none ring-transparent focus-visible:ring-transparent'
                  />
                  <span className='text-muted-foreground text-5xl font-mono'>₫</span>
                </div>

                <Slider
                  min={DESIGN_REQUEST_BUDGET_MIN}
                  max={DESIGN_REQUEST_BUDGET_MAX}
                  step={DESIGN_REQUEST_BUDGET_STEP}
                  value={[sliderValue]}
                  onValueChange={(vals) => {
                    const next = vals[0]
                    if (typeof next === 'number') field.onChange(clampBudget(next))
                  }}
                />

                <div className='text-muted-foreground flex justify-between text-xs'>
                  <span>{formatBudget(DESIGN_REQUEST_BUDGET_MIN)}</span>
                  <span>{formatBudget(DESIGN_REQUEST_BUDGET_MAX)}</span>
                </div>
              </Field>
            )
          }}
        />

        <Card className='gap-4 p-4'>
          <div className='-space-y-0.5'>
            <p className='text-base font-semibold'>{t('addressTitle')}</p>
            <p className='text-sm text-muted-foreground'>{t('addressSubtitle')}</p>
          </div>

          <div className='space-y-4'>
            <Controller
              name='designRequest.address'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-1 w-full'>
                  <FieldLabel htmlFor={field.name} className='gap-0.5'>
                    {t('addressLabel')}
                    <span className='text-destructive font-semibold'>*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id={field.name}
                    placeholder={t('addressPlaceholder')}
                    aria-invalid={fieldState.invalid}
                    autoComplete='off'
                    spellCheck={false}
                  />
                </Field>
              )}
            />

            <div className='flex items-center gap-4'>
              <ComboboxField
                control={control}
                name='designRequest.cityCode'
                label={t('cityLabel')}
                placeholder={t('cityPlaceholder')}
                searchPlaceholder={t('citySearchPlaceholder')}
                options={provinces.map((province) => ({
                  label: province.name,
                  value: String(province.code)
                }))}
                onChange={(value) => {
                  if (value === '') {
                    setValue('designRequest.cityCode', -1, { shouldDirty: true, shouldValidate: true })
                    setValue('designRequest.wardCode', -1, { shouldDirty: true, shouldValidate: true })
                    setValue('designRequest.ward', '', { shouldDirty: true, shouldValidate: true })
                    setValue('designRequest.city', '', { shouldDirty: true, shouldValidate: true })
                  } else {
                    const newProvinceCode = Number(value)
                    setValue('designRequest.cityCode', newProvinceCode, { shouldDirty: true, shouldValidate: true })

                    const provinceName = provinces.find((province) => province.code === newProvinceCode)?.name
                    if (provinceName) {
                      setValue('designRequest.city', provinceName, { shouldDirty: true, shouldValidate: true })
                    }

                    if (newProvinceCode !== cityCodeForm) {
                      setValue('designRequest.wardCode', -1, { shouldDirty: true, shouldValidate: true })
                      setValue('designRequest.ward', '', { shouldDirty: true, shouldValidate: true })
                    }
                  }
                }}
                disabled={isLoadingProvinces || provinces.length === 0}
                className='flex-1'
                isRequired
                modal
              />

              <ComboboxField
                control={control}
                name='designRequest.wardCode'
                label={t('wardLabel')}
                placeholder={t('wardPlaceholder')}
                searchPlaceholder={t('wardSearchPlaceholder')}
                options={wards.map((ward) => ({
                  label: ward.name,
                  value: String(ward.code)
                }))}
                onChange={(value) => {
                  if (value === '') {
                    setValue('designRequest.wardCode', -1, { shouldDirty: true, shouldValidate: true })
                    setValue('designRequest.ward', '', { shouldDirty: true, shouldValidate: true })
                  } else {
                    setValue('designRequest.wardCode', Number(value), { shouldDirty: true, shouldValidate: true })
                    const wardName = wards.find((ward) => ward.code === Number(value))?.name
                    if (wardName) {
                      setValue('designRequest.ward', wardName, { shouldDirty: true, shouldValidate: true })
                    }
                  }
                }}
                disabled={isLoadingWards || wards.length === 0}
                className='flex-1'
                isRequired
                modal
              />
            </div>
          </div>
        </Card>

        <Controller
          name='designRequest.style'
          control={control}
          render={({ field, fieldState }) => {
            const labelId = `${field.name}-label`

            return (
              <Field data-invalid={fieldState.invalid} className='gap-3'>
                <div className='-space-y-0.5'>
                  <FieldLabel className='text-base font-semibold'>{t('styleLabel')}</FieldLabel>
                  <p className='text-sm text-muted-foreground'>{t('styleSubtitle')}</p>
                </div>

                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-labelledby={labelId}
                  aria-invalid={fieldState.invalid}
                  className='grid gap-4 sm:grid-cols-3'
                >
                  {HOUSE_STYLE_OPTIONS.map((option) => {
                    const isSelected = field.value === option

                    return (
                      <RadioCardOption
                        key={option}
                        value={option}
                        title={t(`style.${option}`)}
                        description={t(`styleDescription.${option}`)}
                        invalid={fieldState.invalid}
                        icon={
                          <TraditionalRoofHouseIcon
                            aria-hidden='true'
                            className={cn(
                              'h-auto w-18 shrink-0 transition-colors',
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            )}
                            strokeColor='currentColor'
                            accentStrokeColor='currentColor'
                            {...(isSelected && {
                              bodyFill: 'color-mix(in oklch, currentColor 12%, transparent)',
                              roofFill: 'color-mix(in oklch, currentColor 28%, transparent)',
                              roofSideFill: 'color-mix(in oklch, currentColor 22%, transparent)',
                              sideFill: 'color-mix(in oklch, currentColor 22%, transparent)',
                              windowFill: 'color-mix(in oklch, currentColor 30%, transparent)',
                              doorFill: 'color-mix(in oklch, currentColor 32%, transparent)',
                              shadowFill: 'color-mix(in oklch, currentColor 22%, transparent)'
                            })}
                          />
                        }
                      />
                    )
                  })}
                </RadioGroup>
              </Field>
            )
          }}
        />

        {showRoofStyle && (
          <Controller
            name='designRequest.roofStyle'
            control={control}
            render={({ field, fieldState }) => {
              const labelId = `${field.name}-label`

              return (
                <Field data-invalid={fieldState.invalid} className='gap-3'>
                  <div className='-space-y-0.5'>
                    <FieldLabel className='text-base font-semibold'>{t('roofStyleLabel')}</FieldLabel>
                    <p className='text-sm text-muted-foreground'>{t('roofStyleSubtitle')}</p>
                  </div>

                  <RadioGroup
                    name={field.name}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    aria-labelledby={labelId}
                    aria-invalid={fieldState.invalid}
                    className='grid grid-cols-2 gap-4'
                  >
                    {ROOF_STYLE_OPTIONS.map((option) => {
                      const isSelected = field.value === option

                      return (
                        <RadioCardOption
                          key={option}
                          value={option}
                          title={t(`roofStyle.${option}`)}
                          description={t(`roofStyleDescription.${option}`)}
                          invalid={fieldState.invalid}
                          icon={
                            <ThaiRoofIcon
                              aria-hidden='true'
                              className={cn(
                                'h-auto w-18 shrink-0 transition-colors',
                                isSelected ? 'text-primary' : 'text-muted-foreground'
                              )}
                              strokeColor='currentColor'
                              accentStrokeColor='currentColor'
                              {...(isSelected && {
                                roofFill: 'color-mix(in oklch, currentColor 28%, transparent)',
                                roofSideFill: 'color-mix(in oklch, currentColor 22%, transparent)',
                                ridgeFill: 'color-mix(in oklch, currentColor 12%, transparent)'
                              })}
                            />
                          }
                        />
                      )
                    })}
                  </RadioGroup>
                </Field>
              )
            }}
          />
        )}

        {showTum && (
          <Controller
            name='designRequest.hasTum'
            control={control}
            render={({ field, fieldState }) => {
              const labelId = `${field.name}-label`
              const currentValue = field.value ? 'yes' : 'no'

              return (
                <Field data-invalid={fieldState.invalid} className='gap-3'>
                  <div className='-space-y-0.5'>
                    <FieldLabel className='text-base font-semibold'>{t('tumLabel')}</FieldLabel>
                    <p className='text-sm text-muted-foreground'>{t('tumSubtitle')}</p>
                  </div>

                  <RadioGroup
                    name={field.name}
                    value={currentValue}
                    onValueChange={(v) => field.onChange(v === 'yes')}
                    aria-labelledby={labelId}
                    aria-invalid={fieldState.invalid}
                    className='grid grid-cols-2 gap-4'
                  >
                    {(['yes', 'no'] as const).map((option) => {
                      const isSelected = currentValue === option

                      return (
                        <RadioCardOption
                          key={option}
                          value={option}
                          title={t(`tum.${option}`)}
                          description={t(`tumDescription.${option}`)}
                          invalid={fieldState.invalid}
                          icon={
                            <TumPartIcon
                              aria-hidden='true'
                              className={cn(
                                'h-auto w-18 shrink-0 transition-colors',
                                isSelected ? 'text-primary' : 'text-muted-foreground'
                              )}
                              strokeColor='currentColor'
                              accentStrokeColor='currentColor'
                              {...(isSelected && {
                                platformFill: 'color-mix(in oklch, currentColor 12%, transparent)',
                                platformSideFill: 'color-mix(in oklch, currentColor 22%, transparent)',
                                tumBodyFill: 'color-mix(in oklch, currentColor 12%, transparent)',
                                tumSideFill: 'color-mix(in oklch, currentColor 22%, transparent)',
                                tumRoofFill: 'color-mix(in oklch, currentColor 28%, transparent)',
                                windowFill: 'color-mix(in oklch, currentColor 30%, transparent)',
                                doorFill: 'color-mix(in oklch, currentColor 32%, transparent)'
                              })}
                            />
                          }
                        />
                      )
                    })}
                  </RadioGroup>
                </Field>
              )
            }}
          />
        )}

        <Controller
          name='designRequest.direction'
          control={control}
          render={({ field }) => (
            <Field className='gap-4'>
              <div className='-space-y-0.5'>
                <FieldLabel className='text-base font-semibold'>{t('directionLabel')}</FieldLabel>
                <p className='text-sm text-muted-foreground'>{t('directionSubtitle')}</p>
              </div>

              <RadioGroup value={field.value} onValueChange={field.onChange} className='grid gap-4 sm:grid-cols-2'>
                {DIRECTION_OPTIONS.map((option) => (
                  <RadioCardOption
                    key={option}
                    value={option}
                    title={t(`direction.${option}`)}
                    description={t(`directionDescription.${option}`)}
                    icon={<DirectionCompassIcon direction={option} className='size-16' />}
                  />
                ))}
              </RadioGroup>
            </Field>
          )}
        />

        <div className='space-y-3'>
          <div className='-space-y-0.5'>
            <p className='text-base font-semibold'>{t('floorsLabel')}</p>
            <p className='text-sm text-muted-foreground'>{t('floorsDescription')}</p>
          </div>

          <FloorCardsForm
            control={control}
            floorFields={floorFields}
            appendFloor={appendFloor}
            insertFloor={insertFloor}
            removeFloor={removeFloor}
          />
        </div>

        <div className='flex items-center justify-end gap-2'>
          {project.prevUrl && (
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' })
                router.push(project.prevUrl!)
              }}
            >
              {tc('back')}
            </Button>
          )}
          <Button type='submit'>{tc('next')}</Button>
        </div>
      </form>
    </FormProvider>
  )
}
