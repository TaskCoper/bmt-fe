'use client'

import { Fragment, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

import type { Locale } from '@/i18n/routing'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/constants/routes'
import { formatCurrency } from '@/shared/utils'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { ESTIMATE_BUILDINGS, ESTIMATE_PACKAGES } from '../constants/estimate.constants'
import { calcEstimate } from '../services/estimate.service'
import type { EstimateInput } from '../types/estimate.types'

const INITIAL: EstimateInput = {
  area: 100,
  floors: 1,
  rooms: 2,
  building: 'apartment',
  packageId: 'standard'
}

/** Standalone cost estimator (Q&A §5.1): inputs → live breakdown. */
export function EstimateCreator() {
  const t = useTranslations('estimate.creator')
  const locale = useLocale() as Locale
  const router = useRouter()
  const [input, setInput] = useState<EstimateInput>(INITIAL)
  const [saveOpen, setSaveOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const result = useMemo(() => calcEstimate(input), [input])
  const money = (v: number) => formatCurrency(v, locale)

  const handleSave = () => {
    setSaveOpen(false)
    toast.success(t('saved'), {
      action: { label: t('viewList'), onClick: () => router.push(ROUTES.ESTIMATES) }
    })
  }

  return (
    <Card>
      <CardContent className='grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8'>
        {/* Inputs */}
        <div className='space-y-4'>
          <h3 className='text-base font-semibold'>{t('inputsTitle')}</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='area'>{t('areaLabel')}</Label>
              <Input
                id='area'
                type='number'
                min={0}
                value={input.area || ''}
                onChange={(e) => setInput((s) => ({ ...s, area: Number(e.target.value) }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='floors'>{t('floorsLabel')}</Label>
              <Input
                id='floors'
                type='number'
                min={1}
                max={3}
                value={input.floors || ''}
                onChange={(e) => setInput((s) => ({ ...s, floors: Number(e.target.value) }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='rooms'>{t('roomsLabel')}</Label>
              <Input
                id='rooms'
                type='number'
                min={0}
                value={input.rooms || ''}
                onChange={(e) => setInput((s) => ({ ...s, rooms: Number(e.target.value) }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>{t('buildingLabel')}</Label>
              <Select
                value={input.building}
                onValueChange={(v) =>
                  setInput((s) => ({
                    ...s,
                    building: v as EstimateInput['building']
                  }))
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTIMATE_BUILDINGS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {t(`building.${b}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label>{t('packageLabel')}</Label>
            <RadioGroup
              value={input.packageId}
              onValueChange={(v) =>
                setInput((s) => ({
                  ...s,
                  packageId: v as EstimateInput['packageId']
                }))
              }
              className='gap-2'
            >
              {ESTIMATE_PACKAGES.map((p) => (
                <label
                  key={p.id}
                  className='hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3'
                >
                  <span className='flex items-center gap-3'>
                    <RadioGroupItem value={p.id} />
                    <span className='text-sm font-medium'>{t(`package.${p.id}`)}</span>
                  </span>
                  <span className='text-muted-foreground text-xs'>
                    {money(p.finishingPerSqm + p.interiorPerSqm)}/m²
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Result */}
        <div className='space-y-4 lg:border-l lg:pl-8'>
          <h3 className='text-base font-semibold'>{t('resultTitle')}</h3>
          <div className='rounded-lg border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.portion')}</TableHead>
                  <TableHead className='text-right'>{t('columns.quantity')}</TableHead>
                  <TableHead className='text-right'>{t('columns.unitPrice')}</TableHead>
                  <TableHead className='text-right'>{t('columns.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.lines.map((line) => (
                  <Fragment key={line.portion}>
                    {/* Portion subtotal */}
                    <TableRow className='bg-muted/30'>
                      <TableCell className='font-semibold'>{t(`portion.${line.portion}`)}</TableCell>
                      <TableCell className='text-right tabular-nums'>
                        {line.quantity} {line.unit}
                      </TableCell>
                      <TableCell className='text-right font-medium tabular-nums'>{money(line.unitPrice)}</TableCell>
                      <TableCell className='text-right font-semibold tabular-nums'>{money(line.amount)}</TableCell>
                    </TableRow>
                    {/* Sub-items (materials, labour, …) */}
                    {line.items.map((it) => (
                      <TableRow key={it.key} className='text-muted-foreground'>
                        <TableCell className='py-2 pl-8 text-sm font-normal'>{t(`subPortion.${it.key}`)}</TableCell>
                        <TableCell className='py-2 text-right text-sm tabular-nums'>
                          {it.quantity} {it.unit}
                        </TableCell>
                        <TableCell className='py-2 text-right text-sm tabular-nums'>{money(it.unitPrice)}</TableCell>
                        <TableCell className='py-2 text-right text-sm tabular-nums'>{money(it.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
                <TableRow className='bg-muted/50'>
                  <TableCell colSpan={3} className='font-semibold'>
                    {t('total')}
                  </TableCell>
                  <TableCell className='text-primary text-right text-base font-bold tabular-nums'>
                    {money(result.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <p className='text-muted-foreground text-xs'>{t('disclaimer')}</p>

          <div className='flex flex-wrap gap-2'>
            <Button onClick={() => setSaveOpen(true)}>
              <Save className='size-4' />
              {t('save')}
            </Button>
          </div>

          {/* Save dialog — name + description, then go to the list */}
          <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>{t('saveDialog.title')}</DialogTitle>
                <DialogDescription>{t('saveDialog.description')}</DialogDescription>
              </DialogHeader>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='estimate-name'>{t('saveDialog.nameLabel')}</Label>
                  <Input
                    id='estimate-name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('saveDialog.namePlaceholder')}
                    autoFocus
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='estimate-desc'>{t('saveDialog.descLabel')}</Label>
                  <Textarea
                    id='estimate-desc'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('saveDialog.descPlaceholder')}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>{t('saveDialog.cancel')}</Button>
                </DialogClose>
                <Button onClick={handleSave} disabled={!name.trim() || !description.trim()}>
                  {t('saveDialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
