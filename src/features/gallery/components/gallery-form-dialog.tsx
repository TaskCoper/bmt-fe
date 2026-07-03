'use client';

import { type ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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
import {
  GALLERY_BUILDING,
  GALLERY_KIND,
  GALLERY_STYLE,
} from '../constants/gallery.constants';
import type { GalleryItem } from '../types/gallery.types';

/** Admin create/edit dialog for a design-library item (Q&A §6 / §7.2.2). */
export function GalleryFormDialog({
  trigger,
  item,
}: {
  trigger: ReactNode;
  item?: GalleryItem;
}) {
  const t = useTranslations('gallery.form');
  const tGallery = useTranslations('gallery');
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
          id="gallery-form"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast.success(item ? t('updated') : t('created'));
          }}
          className="space-y-4 py-2"
        >
          <div className="space-y-2">
            <Label htmlFor="g-title">{t('titleLabel')}</Label>
            <Input id="g-title" defaultValue={item?.title} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{t('styleLabel')}</Label>
              <Select defaultValue={item?.style ?? GALLERY_STYLE.MODERN}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GALLERY_STYLE).map((s) => (
                    <SelectItem key={s} value={s}>
                      {tGallery(`style.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('buildingLabel')}</Label>
              <Select
                defaultValue={item?.building ?? GALLERY_BUILDING.APARTMENT}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GALLERY_BUILDING).map((b) => (
                    <SelectItem key={b} value={b}>
                      {tGallery(`building.${b}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('kindLabel')}</Label>
              <Select defaultValue={item?.kind ?? GALLERY_KIND.IMAGE}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GALLERY_KIND).map((k) => (
                    <SelectItem key={k} value={k}>
                      {tGallery(`kind.${k}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="g-tags">{t('tagsLabel')}</Label>
            <Input
              id="g-tags"
              defaultValue={item?.tags.join(', ')}
              placeholder={t('tagsPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('fileLabel')}</Label>
            <div className="text-muted-foreground hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm transition-colors">
              <Upload className="size-5" />
              {t('fileHint')}
            </div>
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
          <Button type="submit" form="gallery-form">
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
