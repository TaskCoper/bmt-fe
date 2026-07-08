'use client'

import { type ReactNode, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
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
import { LIBRARY_CATEGORY, PRICE_REGION } from '../constants/library.constants'
import type { LibraryItem } from '../types/library.types'

/** Create/edit a unit-price row (Q&A §5.2.2 — Admin manages prices in CMS). */
export function PriceFormDialog({ trigger, item }: { trigger: ReactNode; item?: LibraryItem }) {
  const t = useTranslations('library.form')
  const tCat = useTranslations('library.category')
  const tRegion = useTranslations('library.region')
  const [open, setOpen] = useState(false)

  function onSave() {
    setOpen(false)
    toast.success(item ? t('updated') : t('created'))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? t('editTitle') : t('createTitle')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <form
          id='price-form'
          onSubmit={(e) => {
            e.preventDefault()
            onSave()
          }}
          className='grid gap-4 py-2 sm:grid-cols-2'
        >
          <div className='space-y-2'>
            <Label htmlFor='code'>{t('codeLabel')}</Label>
            <Input id='code' defaultValue={item?.code} required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='unit'>{t('unitLabel')}</Label>
            <Input id='unit' defaultValue={item?.unit} required />
          </div>
          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='name'>{t('nameLabel')}</Label>
            <Input id='name' defaultValue={item?.name} required />
          </div>
          <div className='space-y-2'>
            <Label>{t('categoryLabel')}</Label>
            <Select defaultValue={item?.category ?? LIBRARY_CATEGORY.MATERIAL}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LIBRARY_CATEGORY).map((c) => (
                  <SelectItem key={c} value={c}>
                    {tCat(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>{t('regionLabel')}</Label>
            <Select defaultValue={item?.region ?? PRICE_REGION.NORTH}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PRICE_REGION).map((r) => (
                  <SelectItem key={r} value={r}>
                    {tRegion(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2 sm:col-span-2'>
            <Label htmlFor='unitPrice'>{t('unitPriceLabel')}</Label>
            <Input id='unitPrice' type='number' min={0} defaultValue={item?.unitPrice} required />
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>{t('cancel')}</Button>
          </DialogClose>
          <Button type='submit' form='price-form'>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
