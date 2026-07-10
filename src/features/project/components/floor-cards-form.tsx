'use client'

import { RadioCardOption } from '@/shared/components/common/radio-card-option'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  RadioGroup
} from '@/shared/components/ui'
import { Field, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { Grid2X2, LayoutTemplate, Lightbulb, PlusCircleIcon, Sun, Trash2, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Controller,
  useWatch,
  type Control,
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayInsert,
  type UseFieldArrayRemove
} from 'react-hook-form'
import { DESIGN_REQUEST_NORMAL_FLOORS_MAX, type DesignRequestFormValues } from '../schemas/project.schema'
import { COLOR_PRESETS, FloorLayout, FloorLighting } from '../types/project.types'
import FloorCard, { type FloorCardData } from './floor-card'

const LAYOUT_OPTIONS = [FloorLayout.Open, FloorLayout.Separated] as const
const LIGHTING_OPTIONS = [FloorLighting.Natural, FloorLighting.Artificial] as const

const LAYOUT_ICONS: Record<FloorLayout, LucideIcon> = {
  [FloorLayout.Open]: LayoutTemplate,
  [FloorLayout.Separated]: Grid2X2
}

const LIGHTING_ICONS: Record<FloorLighting, LucideIcon> = {
  [FloorLighting.Natural]: Sun,
  [FloorLighting.Artificial]: Lightbulb
}

type FloorField = FieldArrayWithId<DesignRequestFormValues, 'designRequest.floors', 'id'>

interface FloorCardsFormProps {
  control: Control<DesignRequestFormValues>
  floorFields: FloorField[]
  appendFloor: UseFieldArrayAppend<DesignRequestFormValues, 'designRequest.floors'>
  insertFloor: UseFieldArrayInsert<DesignRequestFormValues, 'designRequest.floors'>
  removeFloor: UseFieldArrayRemove
}

function LucideSlot({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className='bg-muted group-has-data-[state=checked]:bg-primary/10 flex h-11 w-11 items-center justify-center rounded-md transition-colors'>
      <Icon className='h-5 w-5' aria-hidden='true' />
    </div>
  )
}

function getFallbackFloor() {
  return {
    area: 0,
    layout: FloorLayout.Open,
    lighting: FloorLighting.Natural,
    color: COLOR_PRESETS[0],
    isSpecial: false as boolean | undefined
  }
}

export default function FloorCardsForm({
  control,
  floorFields,
  appendFloor,
  insertFloor,
  removeFloor
}: FloorCardsFormProps) {
  const t = useTranslations('project.form')
  const floors = useWatch({ control, name: 'designRequest.floors' })

  const hasSpecialFloor = floors?.some((f) => f.isSpecial) ?? false
  const specialFloorIndex = floors ? floors.findIndex((f) => f.isSpecial) : -1

  const normalFloorCount = floorFields.length - 1 - (hasSpecialFloor ? 1 : 0)

  const handleAddNormalFloor = () => {
    const floor = getFallbackFloor()
    if (hasSpecialFloor && specialFloorIndex !== -1) {
      insertFloor(specialFloorIndex, floor)
    } else {
      appendFloor(floor)
    }
  }

  const handleSpecialFloorToggle = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      appendFloor({ ...getFallbackFloor(), isSpecial: true })
    } else if (specialFloorIndex !== -1) {
      removeFloor(specialFloorIndex)
    }
  }

  const getFloorTitle = (index: number, isSpecial?: boolean): string => {
    if (isSpecial) return t('specialFloorTitle')
    if (index === 0) return t('groundFloorTitle')
    return t('floorTitle', { index })
  }

  return (
    <div className='flex flex-col gap-4'>
      <Accordion type='multiple' className='grid gap-3'>
        {floorFields.map((floor, index) => {
          const floorValue = floors?.[index] ?? getFallbackFloor()
          const isSpecial = floorValue.isSpecial
          const floorCardData: FloorCardData = {
            title: getFloorTitle(index, isSpecial),
            specs: [
              { label: t('areaLabel'), value: floorValue.area || 0, suffix: 'm2' },
              { label: t('layoutLabel'), value: t(`layout.${floorValue.layout}`) },
              { label: t('lightingLabel'), value: t(`lighting.${floorValue.lighting}`) }
            ],
            color: {
              label: t('colorLabel'),
              value: floorValue.color
            },
            plan: {
              label: t('floorsLabel'),
              index,
              total: floorFields.length
            }
          }

          return (
            <AccordionItem key={floor.id} value={floor.id} className='relative border-b-0 shadow-lg rounded-xl'>
              <AccordionTrigger className='group/floor-trigger relative block w-full p-0 text-left hover:no-underline [&>svg]:absolute [&>svg]:top-5 [&>svg]:right-5 [&>svg]:z-20'>
                <FloorCard
                  data={floorCardData}
                  className='hover:translate-y-0 group-data-[state=open]/floor-trigger:hover:shadow-none group-data-[state=open]/floor-trigger:shadow-none group-data-[state=open]/floor-trigger:rounded-b-none group-data-[state=open]/floor-trigger:border-0 '
                />
              </AccordionTrigger>

              <div className='absolute top-3.5 right-10 z-30'>
                {index > 0 && !isSpecial ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => removeFloor(index)}
                    aria-label={t('removeFloor')}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                ) : null}
              </div>

              <AccordionContent className='border-t border-border rounded-b-xl bg-card px-4 pt-4 pb-5 sm:px-5'>
                <div className='grid grid-cols-1 gap-6'>
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
                        <RadioGroup value={field.value} onValueChange={field.onChange} className='grid gap-2'>
                          {LAYOUT_OPTIONS.map((option) => (
                            <RadioCardOption
                              key={option}
                              value={option}
                              title={t(`layout.${option}`)}
                              description={t(`layoutDescription.${option}`)}
                              icon={<LucideSlot icon={LAYOUT_ICONS[option]} />}
                            />
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
                        <RadioGroup value={field.value} onValueChange={field.onChange} className='grid gap-2'>
                          {LIGHTING_OPTIONS.map((option) => (
                            <RadioCardOption
                              key={option}
                              value={option}
                              title={t(`lighting.${option}`)}
                              description={t(`lightingDescription.${option}`)}
                              icon={<LucideSlot icon={LIGHTING_ICONS[option]} />}
                            />
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
                        <div className='flex flex-wrap items-center gap-2'>
                          {COLOR_PRESETS.map((color) => (
                            <button
                              key={color}
                              type='button'
                              aria-label={color}
                              onClick={() => field.onChange(color)}
                              className={cn(
                                'cursor-pointer h-8 w-8 rounded-full border-2 transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                field.value === color
                                  ? 'scale-110 border-primary'
                                  : 'border-transparent hover:scale-105'
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          <label className='relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-input'>
                            <input
                              type='color'
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className='absolute inset-0 cursor-pointer opacity-0'
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
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className='flex items-center justify-between gap-4'>
        <label className='flex cursor-pointer select-none items-center gap-3' htmlFor='special-floor-toggle'>
          <Checkbox checked={hasSpecialFloor} onCheckedChange={handleSpecialFloorToggle} id='special-floor-toggle' />
          <div>
            <p className='text-sm font-medium leading-none'>{t('specialFloorTitle')}</p>
            <p className='text-muted-foreground mt-1 text-xs'>{t('addSpecialFloorDescription')}</p>
          </div>
        </label>

        {normalFloorCount < DESIGN_REQUEST_NORMAL_FLOORS_MAX && (
          <Button type='button' variant='outline' size='sm' onClick={handleAddNormalFloor} className='shrink-0'>
            <PlusCircleIcon />
            {t('addFloor')}
          </Button>
        )}
      </div>
    </div>
  )
}
