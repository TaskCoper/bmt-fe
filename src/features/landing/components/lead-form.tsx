'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { LEAD_NEED_TYPES } from '../constants/landing.constants'
import { createLeadSchema, type LeadFormValues } from '../schemas/lead.schema'

/**
 * Public contact / lead-capture form. UI-first: submission is mocked (no
 * backend) — it simulates saving the lead and shows a success toast.
 */
export function LeadForm() {
  const t = useTranslations('landing.lead')
  const tv = useTranslations('validation')
  const [pending, setPending] = useState(false)

  const schema = useMemo(
    () =>
      createLeadSchema({
        required: tv('required'),
        email: tv('email'),
        phone: tv('phone'),
      }),
    [tv],
  )

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      needType: 'design',
      message: '',
    },
  })

  function onSubmit() {
    setPending(true)
    setTimeout(() => {
      setPending(false)
      toast.success(t('success'))
      form.reset()
    }, 800)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('nameLabel')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder={t('namePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('phoneLabel')} <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder={t('phonePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('emailLabel')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder={t('emailPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="needType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('needTypeLabel')}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEAD_NEED_TYPES.map((nt) => (
                      <SelectItem key={nt} value={nt}>
                        {t(`needType.${nt}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('messageLabel')}</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder={t('messagePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="size-3.5" />
            {t('spamNote')}
          </p>
          <Button type="submit" disabled={pending} className="sm:w-auto">
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            {t('submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
