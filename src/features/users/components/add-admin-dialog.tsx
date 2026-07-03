'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  createAdminSchema,
  type AdminFormValues,
} from '../schemas/admin.schema';

/**
 * Create-admin dialog. Admins can only create other admins (customers
 * self-register) — stakeholder Q&A §7.2.1. UI-first: submission is mocked.
 */
export function AddAdminDialog() {
  const t = useTranslations('users.addAdmin');
  const tv = useTranslations('validation');
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const schema = useMemo(
    () => createAdminSchema({ required: tv('required'), email: tv('email') }),
    [tv],
  );

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  function onSubmit() {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setOpen(false);
      form.reset();
      toast.success(t('success'));
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4" />
          {t('trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="add-admin-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('namePlaceholder')} {...field} />
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
                      placeholder={t('emailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button type="submit" form="add-admin-form" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            {t('submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
