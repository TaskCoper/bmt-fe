'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { ComboboxField } from '@/shared/components/common/combobox-field'
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Slider
} from '@/shared/components/ui'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { useGetProvinces } from '@/shared/hooks/use-get-provinces'
import { useGetWards } from '@/shared/hooks/use-get-wards'
import { cn } from '@/shared/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, FormProvider, type SubmitHandler, useFieldArray } from 'react-hook-form'
import { useDesignRequest } from '../hooks/use-design-request'
import { type DesignRequestFormValues } from '../schemas/project.schema'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'
import { COLOR_PRESETS, Direction, FloorLayout, FloorLighting, HouseStyle, RoofStyle } from '../types/project.types'

const HOUSE_STYLE_OPTIONS = [HouseStyle.Roof, HouseStyle.Modern, HouseStyle.Neoclassical] as const
const ROOF_STYLE_OPTIONS = [RoofStyle.Thai, RoofStyle.Japanese, RoofStyle.Traditional, RoofStyle.Other] as const
const DIRECTION_OPTIONS = [Direction.East, Direction.West, Direction.South, Direction.North] as const
const LAYOUT_OPTIONS = [FloorLayout.Open, FloorLayout.Separated] as const
const LIGHTING_OPTIONS = [FloorLighting.Natural, FloorLighting.Artificial] as const

const BUDGET_MIN = 300_000_000
const BUDGET_MAX = 15_000_000_000
const BUDGET_STEP = 50_000_000
const BUDGET_DEFAULT = 2_000_000_000
const BUDGET_VND = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })

function formatBudget(value: number): string {
  return `${BUDGET_VND.format(value)} ₫`
}

function clampBudget(value: number): number {
  if (!Number.isFinite(value)) return BUDGET_DEFAULT
  return Math.min(Math.max(value, BUDGET_MIN), BUDGET_MAX)
}

export default function ProjectDesignRequest({ slug }: { slug: string }) {
  const t = useTranslations('project.form')
  const tc = useTranslations('common')

  const projects = useProjectStore((s) => s.projects)
  const router = useRouter()
  const { methods } = useDesignRequest()

  const updateProject = useProjectStore((s) => s.updateProject)

  useSetProjectFlow(slug, 'design-request')

  const project = projects[slug]
  const draft = project?.designRequest

  const { setValue, watch, reset, control, handleSubmit } = methods

  const cityCodeForm = watch('designRequest.cityCode')
  const styleForm = watch('designRequest.style')

  const { provinces, isLoadingProvinces } = useGetProvinces()
  const { wards, isLoadingWards } = useGetWards(cityCodeForm ?? -1)

  const {
    fields: floorFields,
    append: appendFloor,
    remove: removeFloor
  } = useFieldArray({
    control,
    name: 'designRequest.floors'
  })

  const onSubmit: SubmitHandler<DesignRequestFormValues> = (body) => {
    updateProject({ slug, patch: { designRequest: body.designRequest } })
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
        budgetAmount: draft?.budgetAmount ?? BUDGET_DEFAULT,
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
    <div className='space-y-8'>
      <div>
        <p className='font-semibold text-2xl'>{t('designRequestTitle')}</p>
        <p className='text-sm text-muted-foreground'>{t('designRequestSubtitle')}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='designRequest.style'
            control={control}
            render={({ field }) => (
              <Field className='gap-2'>
                <FieldLabel className='gap-0.5'>
                  {t('styleLabel')}
                  <span className='text-destructive font-semibold'>*</span>
                </FieldLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v)
                    if (v !== HouseStyle.Roof) setValue('designRequest.roofStyle', undefined)
                    if (v === HouseStyle.Roof) setValue('designRequest.hasTum', false)
                  }}
                  className='grid grid-cols-1 sm:grid-cols-3 gap-3'
                >
                  {HOUSE_STYLE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                        field.value === option ? 'border-primary bg-primary/5' : 'border-input hover:bg-accent'
                      )}
                    >
                      <RadioGroupItem value={option} />
                      <span className='text-sm font-medium'>{t(`style.${option}`)}</span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>
            )}
          />

          {showRoofStyle && (
            <Controller
              name='designRequest.roofStyle'
              control={control}
              render={({ field }) => (
                <Field className='gap-2'>
                  <FieldLabel className='gap-0.5'>{t('roofStyleLabel')}</FieldLabel>
                  <RadioGroup
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    className='grid grid-cols-2 sm:grid-cols-4 gap-3'
                  >
                    {ROOF_STYLE_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className={cn(
                          'flex items-center gap-2 rounded-md border p-2 cursor-pointer transition-colors',
                          field.value === option ? 'border-primary bg-primary/5' : 'border-input hover:bg-accent'
                        )}
                      >
                        <RadioGroupItem value={option} />
                        <span className='text-sm'>{t(`roofStyle.${option}`)}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </Field>
              )}
            />
          )}

          {showTum && (
            <Controller
              name='designRequest.hasTum'
              control={control}
              render={({ field }) => (
                <Field className='gap-2'>
                  <FieldLabel className='gap-0.5'>{t('tumLabel')}</FieldLabel>
                  <RadioGroup
                    value={field.value ? 'yes' : 'no'}
                    onValueChange={(v) => field.onChange(v === 'yes')}
                    className='grid grid-cols-2 gap-3 max-w-md'
                  >
                    {(['yes', 'no'] as const).map((option) => {
                      const selected = (field.value ? 'yes' : 'no') === option
                      return (
                        <label
                          key={option}
                          className={cn(
                            'flex items-center gap-2 rounded-md border p-2 cursor-pointer transition-colors',
                            selected ? 'border-primary bg-primary/5' : 'border-input hover:bg-accent'
                          )}
                        >
                          <RadioGroupItem value={option} />
                          <span className='text-sm'>{t(`tum.${option}`)}</span>
                        </label>
                      )
                    })}
                  </RadioGroup>
                </Field>
              )}
            />
          )}

          <Controller
            name='designRequest.direction'
            control={control}
            render={({ field }) => (
              <Field className='gap-2'>
                <FieldLabel className='gap-0.5'>
                  {t('directionLabel')}
                  <span className='text-destructive font-semibold'>*</span>
                </FieldLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className='grid grid-cols-2 sm:grid-cols-4 gap-3'
                >
                  {DIRECTION_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-md border p-2 cursor-pointer transition-colors',
                        field.value === option ? 'border-primary bg-primary/5' : 'border-input hover:bg-accent'
                      )}
                    >
                      <RadioGroupItem value={option} />
                      <span className='text-sm'>{t(`direction.${option}`)}</span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>
            )}
          />

          <Separator />

          <Controller
            name='designRequest.budgetAmount'
            control={control}
            render={({ field }) => {
              const current = clampBudget(field.value ?? BUDGET_DEFAULT)
              return (
                <Field className='gap-3'>
                  <FieldLabel className='gap-0.5'>
                    Ngân sách dự kiến
                    <span className='text-destructive font-semibold'>*</span>
                  </FieldLabel>
                  <p className='text-muted-foreground text-xs'>
                    Kéo thanh trượt hoặc nhập trực tiếp mức ngân sách tổng bạn dự trù cho công trình. Ở bước 4, hệ thống
                    sẽ so sánh dự toán với con số này khi bạn chọn các gói vật liệu khác nhau.
                  </p>

                  <div className='flex items-center gap-3'>
                    <Input
                      type='number'
                      inputMode='numeric'
                      min={BUDGET_MIN}
                      max={BUDGET_MAX}
                      step={BUDGET_STEP}
                      value={current}
                      onChange={(e) => {
                        const parsed = e.target.valueAsNumber
                        field.onChange(Number.isFinite(parsed) ? parsed : BUDGET_DEFAULT)
                      }}
                      className='w-56'
                    />
                    <span className='text-muted-foreground text-sm'>₫</span>
                    <span className='text-foreground text-sm font-semibold tabular-nums'>{formatBudget(current)}</span>
                  </div>

                  <Slider
                    min={BUDGET_MIN}
                    max={BUDGET_MAX}
                    step={BUDGET_STEP}
                    value={[current]}
                    onValueChange={(vals) => {
                      const next = vals[0]
                      if (typeof next === 'number') field.onChange(clampBudget(next))
                    }}
                    className='pt-2'
                  />

                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span>{formatBudget(BUDGET_MIN)}</span>
                    <span>{formatBudget(BUDGET_MAX)}</span>
                  </div>
                </Field>
              )
            }}
          />

          <Separator />

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
                <div className='min-h-4'>
                  {fieldState.invalid && <FieldError className='text-xs' errors={[fieldState.error]} />}
                </div>
              </Field>
            )}
          />

          <Separator />

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <FieldLabel className='gap-0.5'>
                {t('floorsLabel')}
                <span className='text-destructive font-semibold'>*</span>
              </FieldLabel>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() =>
                  appendFloor({
                    area: 0,
                    layout: FloorLayout.Open,
                    lighting: FloorLighting.Natural,
                    color: COLOR_PRESETS[0]
                  })
                }
              >
                <Plus className='h-4 w-4' />
                {t('addFloor')}
              </Button>
            </div>

            <div className='space-y-4'>
              {floorFields.map((floor, index) => (
                <Card key={floor.id}>
                  <CardHeader>
                    <CardTitle className='text-sm'>{t('floorTitle', { index: index + 1 })}</CardTitle>
                    {floorFields.length > 1 && (
                      <CardAction>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeFloor(index)}
                          aria-label={t('removeFloor')}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </CardAction>
                    )}
                  </CardHeader>

                  <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Controller
                      name={`designRequest.floors.${index}.area`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className='gap-1'>
                          <FieldLabel htmlFor={field.name} className='gap-0.5'>
                            {t('areaLabel')}
                            <span className='text-destructive font-semibold'>*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type='number'
                            inputMode='decimal'
                            min={0}
                            step='0.1'
                            value={Number.isFinite(field.value) ? field.value : ''}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            onBlur={field.onBlur}
                            placeholder={t('areaPlaceholder')}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                      )}
                    />

                    <Controller
                      name={`designRequest.floors.${index}.layout`}
                      control={control}
                      render={({ field }) => (
                        <Field className='gap-1'>
                          <FieldLabel className='gap-0.5'>{t('layoutLabel')}</FieldLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className='grid grid-cols-2 gap-2'
                          >
                            {LAYOUT_OPTIONS.map((option) => (
                              <label
                                key={option}
                                className={cn(
                                  'flex items-center gap-2 rounded-md border p-2 cursor-pointer text-sm transition-colors',
                                  field.value === option
                                    ? 'border-primary bg-primary/5'
                                    : 'border-input hover:bg-accent'
                                )}
                              >
                                <RadioGroupItem value={option} />
                                <span>{t(`layout.${option}`)}</span>
                              </label>
                            ))}
                          </RadioGroup>
                        </Field>
                      )}
                    />

                    <Controller
                      name={`designRequest.floors.${index}.lighting`}
                      control={control}
                      render={({ field }) => (
                        <Field className='gap-1'>
                          <FieldLabel className='gap-0.5'>{t('lightingLabel')}</FieldLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className='grid grid-cols-2 gap-2'
                          >
                            {LIGHTING_OPTIONS.map((option) => (
                              <label
                                key={option}
                                className={cn(
                                  'flex items-center gap-2 rounded-md border p-2 cursor-pointer text-sm transition-colors',
                                  field.value === option
                                    ? 'border-primary bg-primary/5'
                                    : 'border-input hover:bg-accent'
                                )}
                              >
                                <RadioGroupItem value={option} />
                                <span>{t(`lighting.${option}`)}</span>
                              </label>
                            ))}
                          </RadioGroup>
                        </Field>
                      )}
                    />

                    <Controller
                      name={`designRequest.floors.${index}.color`}
                      control={control}
                      render={({ field }) => (
                        <Field className='gap-1'>
                          <FieldLabel className='gap-0.5'>{t('colorLabel')}</FieldLabel>
                          <div className='flex items-center gap-2 flex-wrap'>
                            {COLOR_PRESETS.map((color) => (
                              <button
                                key={color}
                                type='button'
                                aria-label={color}
                                onClick={() => field.onChange(color)}
                                className={cn(
                                  'h-8 w-8 rounded-full border-2 transition-transform',
                                  field.value === color
                                    ? 'border-primary scale-110'
                                    : 'border-transparent hover:scale-105'
                                )}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            <label className='relative h-8 w-8 rounded-full border-2 border-dashed border-input flex items-center justify-center cursor-pointer overflow-hidden'>
                              <input
                                type='color'
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className='absolute inset-0 opacity-0 cursor-pointer'
                              />
                              <span
                                className='h-4 w-4 rounded-full'
                                style={{ backgroundColor: field.value }}
                                aria-hidden
                              />
                            </label>
                          </div>
                        </Field>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className='flex items-center justify-end gap-2'>
            {project.prevUrl && (
              <Button type='button' variant='outline' asChild>
                <Link href={project.prevUrl}>{tc('back')}</Link>
              </Button>
            )}
            <Button type='submit'>{tc('next')}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
