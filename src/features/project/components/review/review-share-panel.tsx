'use client'

import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator
} from '@/shared/components/ui'
import { FileDown, Link2, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReviewSection } from './review-sections'

interface ReviewSharePanelProps {
  sections: readonly ReviewSection[]
  included: Record<string, boolean>
  onToggleSection: (key: string, next: boolean) => void
  onToggleAll: (next: boolean) => void
  allSelected: boolean
  language: 'vi' | 'en'
  onLanguageChange: (value: 'vi' | 'en') => void
  currency: 'vnd' | 'usd'
  onCurrencyChange: (value: 'vnd' | 'usd') => void
  onExportPdf: () => void
  onShareLink: () => void
  onSendEmail: () => void
  isExporting: boolean
}

export function ReviewSharePanel({
  sections,
  included,
  onToggleSection,
  onToggleAll,
  allSelected,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  onExportPdf,
  onShareLink,
  onSendEmail,
  isExporting
}: ReviewSharePanelProps) {
  const t = useTranslations('project.form.review')

  return (
    <Card className='sticky top-6 gap-4'>
      <CardContent className='space-y-5'>
        <header className='space-y-1'>
          <p className='text-sm font-semibold'>{t('options.title')}</p>
          <p className='text-muted-foreground text-xs'>{t('options.description')}</p>
        </header>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-medium'>{t('options.selectSections')}</p>
            <button
              type='button'
              onClick={() => onToggleAll(!allSelected)}
              className='text-primary text-xs font-medium hover:underline'
            >
              {allSelected ? t('options.deselectAll') : t('options.selectAll')}
            </button>
          </div>

          <ul className='space-y-1.5'>
            {sections.map((section) => {
              const id = `share-toggle-${section.key}`
              return (
                <li key={section.key} className='flex items-center gap-2'>
                  <Checkbox
                    id={id}
                    checked={included[section.key] ?? false}
                    onCheckedChange={(checked) => onToggleSection(section.key, checked === true)}
                  />
                  <label htmlFor={id} className='cursor-pointer text-sm'>
                    {section.title}
                  </label>
                </li>
              )
            })}
          </ul>
        </div>

        <Separator />

        <div className='space-y-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='review-language' className='text-xs'>
              {t('options.languageLabel')}
            </Label>
            <Select value={language} onValueChange={(value) => onLanguageChange(value as 'vi' | 'en')}>
              <SelectTrigger id='review-language' className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='vi'>{t('options.language.vi')}</SelectItem>
                <SelectItem value='en' disabled>
                  {t('options.language.en')}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className='text-muted-foreground text-xs'>{t('options.languageHint')}</p>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='review-currency' className='text-xs'>
              {t('options.currencyLabel')}
            </Label>
            <Select value={currency} onValueChange={(value) => onCurrencyChange(value as 'vnd' | 'usd')}>
              <SelectTrigger id='review-currency' className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='vnd'>{t('options.currency.vnd')}</SelectItem>
                <SelectItem value='usd' disabled>
                  {t('options.currency.usd')}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className='text-muted-foreground text-xs'>{t('options.currencyHint')}</p>
          </div>
        </div>

        <Separator />

        <div className='space-y-2'>
          <Button type='button' className='w-full' onClick={onExportPdf} disabled={isExporting}>
            <FileDown className='size-4' />
            {isExporting ? t('actions.exporting') : t('actions.exportPdf')}
          </Button>
          <Button type='button' variant='outline' className='w-full' onClick={onShareLink}>
            <Link2 className='size-4' />
            {t('actions.shareLink')}
          </Button>
          <Button type='button' variant='outline' className='w-full' onClick={onSendEmail}>
            <Mail className='size-4' />
            {t('actions.sendEmail')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
