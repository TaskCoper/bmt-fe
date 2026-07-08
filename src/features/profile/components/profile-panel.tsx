'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Camera, Loader2 } from 'lucide-react'

import { getInitials } from '@/shared/utils'
import { useAuth, useAuthStore } from '@/shared/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { createProfileSchema, type ProfileFormValues } from '../schemas/profile.schema'

/** Profile page: identity summary card + editable details form (mock save). */
export function ProfilePanel() {
  const t = useTranslations('profile')
  const tv = useTranslations('validation')
  const { user } = useAuth()
  const [pending, setPending] = useState(false)

  const schema = useMemo(
    () =>
      createProfileSchema({
        required: tv('required'),
        maxBio: tv('maxLength', { max: 500 })
      }),
    [tv]
  )

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      phone: '',
      company: '',
      bio: ''
    }
  })

  function onSubmit(values: ProfileFormValues) {
    setPending(true)
    setTimeout(() => {
      setPending(false)
      // Persist the editable name back into the shared auth store (mock).
      if (user) useAuthStore.getState().setUser({ ...user, name: values.name })
      toast.success(t('saved'))
    }, 700)
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
      {/* Identity card */}
      <Card className='h-fit'>
        <CardHeader className='items-center text-center'>
          <div className='relative'>
            <Avatar className='size-24'>
              <AvatarImage src={user?.avatarUrl} alt={user?.name ?? ''} />
              <AvatarFallback className='text-2xl'>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <Button
              type='button'
              size='icon'
              variant='outline'
              className='absolute right-0 bottom-0 size-8 rounded-full'
              onClick={() => toast.info(t('avatarSoon'))}
              aria-label={t('changeAvatar')}
            >
              <Camera className='size-4' />
            </Button>
          </div>
          <CardTitle className='mt-3'>{user?.name}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
          <div className='mt-2 flex flex-wrap justify-center gap-1'>
            {user?.roles.map((role) => (
              <Badge key={role} variant='secondary'>
                {t(`role.${role}`)}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Editable details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detailsTitle')}</CardTitle>
          <CardDescription>{t('detailsHint')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('nameLabel')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input value={user?.email ?? ''} readOnly disabled />
                  </FormControl>
                </FormItem>
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phoneLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('phonePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='company'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('companyLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('companyPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('bioLabel')}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder={t('bioPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end'>
                <Button type='submit' disabled={pending}>
                  {pending ? <Loader2 className='size-4 animate-spin' /> : null}
                  {t('save')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
