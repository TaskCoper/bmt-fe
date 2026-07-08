'use client'

import { type ReactNode, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Bold, Italic, List, Link2, Image as ImageIcon, Upload } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import type { ContentEntry } from '../types/cms.types'

/** Page sections that can be toggled on/off per page (Q&A §7.1.1). */
const SECTIONS = ['hero', 'services', 'process', 'projects', 'about', 'contact'] as const

const LOCALES = ['vi', 'en'] as const

/** A minimal (mock) rich-text toolbar — conveys the RTE requirement. */
function RichToolbar() {
  const buttons = [Bold, Italic, List, Link2, ImageIcon]
  return (
    <div className='flex items-center gap-1 rounded-t-md border border-b-0 p-1'>
      {buttons.map((Icon, i) => (
        <Button key={i} type='button' variant='ghost' size='icon' tabIndex={-1}>
          <Icon className='size-4' />
        </Button>
      ))}
    </div>
  )
}

/**
 * Content create/edit dialog with VI/EN tabs, a rich-text body, page-section
 * toggles and a media area. UI-first: saving is mocked (no backend).
 */
export function ContentEditorDialog({ trigger, entry }: { trigger: ReactNode; entry?: ContentEntry }) {
  const t = useTranslations('cms.editor')
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(SECTIONS.map((s) => [s, true])))

  function onSave() {
    setOpen(false)
    toast.success(t('saved'))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent className='max-h-[90svh] gap-0 overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{entry ? t('editTitle') : t('createTitle')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Bilingual content */}
          <Tabs defaultValue='vi'>
            <TabsList>
              {LOCALES.map((l) => (
                <TabsTrigger key={l} value={l}>
                  {t(`locale.${l}`)}
                </TabsTrigger>
              ))}
            </TabsList>
            {LOCALES.map((l) => (
              <TabsContent key={l} value={l} className='space-y-4 pt-4'>
                <div className='space-y-2'>
                  <Label>{t('titleLabel')}</Label>
                  <Input defaultValue={l === 'vi' ? entry?.title : ''} placeholder={t('titlePlaceholder')} />
                </div>
                <div className='space-y-2'>
                  <Label>{t('bodyLabel')}</Label>
                  <RichToolbar />
                  <Textarea rows={6} className='rounded-t-none' placeholder={t('bodyPlaceholder')} />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Media */}
          <div className='space-y-2'>
            <Label>{t('mediaLabel')}</Label>
            <div className='text-muted-foreground hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm transition-colors'>
              <Upload className='size-5' />
              {t('mediaHint')}
            </div>
          </div>

          {/* Section toggles */}
          <div className='space-y-2'>
            <Label>{t('sectionsLabel')}</Label>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
              {SECTIONS.map((s) => (
                <label
                  key={s}
                  className='hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md border p-2.5 text-sm'
                >
                  <Checkbox
                    checked={enabled[s]}
                    onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [s]: Boolean(v) }))}
                  />
                  {t(`section.${s}`)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>{t('cancel')}</Button>
          </DialogClose>
          <Button onClick={onSave}>{t('save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
