'use client';

import { type ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { PORTFOLIO_CATEGORY } from '../constants/portfolio.constants';
import type { PortfolioItem } from '../types/portfolio.types';

/** Admin create/edit dialog for a portfolio project (Q&A §3.1.2 / CMS). */
export function PortfolioFormDialog({
  trigger,
  item,
}: {
  trigger: ReactNode;
  item?: PortfolioItem;
}) {
  const t = useTranslations('portfolio.form');
  const tCat = useTranslations('portfolio.category');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? t('editTitle') : t('createTitle')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <form
          id="portfolio-form"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast.success(item ? t('updated') : t('created'));
          }}
          className="space-y-4 py-2"
        >
          <div className="space-y-2">
            <Label htmlFor="pf-title">{t('titleLabel')}</Label>
            <Input id="pf-title" defaultValue={item?.title} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('categoryLabel')}</Label>
              <Select
                defaultValue={item?.category ?? PORTFOLIO_CATEGORY.APARTMENT}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PORTFOLIO_CATEGORY).map((c) => (
                    <SelectItem key={c} value={c}>
                      {tCat(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-style">{t('styleLabel')}</Label>
              <Input id="pf-style" defaultValue={item?.style} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-year">{t('yearLabel')}</Label>
              <Input id="pf-year" type="number" defaultValue={item?.year} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-area">{t('areaLabel')}</Label>
              <Input id="pf-area" type="number" defaultValue={item?.area} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="pf-loc">{t('locationLabel')}</Label>
              <Input id="pf-loc" defaultValue={item?.location} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pf-summary">{t('summaryLabel')}</Label>
            <Textarea id="pf-summary" rows={3} defaultValue={item?.summary} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked={item?.published ?? false} />
            {t('publishLabel')}
          </label>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('cancel')}</Button>
          </DialogClose>
          <Button type="submit" form="portfolio-form">
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
