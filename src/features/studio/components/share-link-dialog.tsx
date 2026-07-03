'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Link2, Copy, Ban } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

/**
 * Share-link manager (Q&A §4.3.1): a public link valid for 90 days that the
 * owner can revoke at any time. UI-first mock.
 */
export function ShareLinkDialog({ projectName }: { projectName: string }) {
  const t = useTranslations('studio.share');
  const [revoked, setRevoked] = useState(false);

  const slug = (projectName || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const link = `https://bmt-ai.construction/s/${slug || 'project'}-demo`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link2 className="size-4" />
          {t('manageLink')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('linkTitle')}</DialogTitle>
          <DialogDescription>{t('linkExpiry')}</DialogDescription>
        </DialogHeader>

        {revoked ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">{t('revokedNote')}</p>
            <Button onClick={() => setRevoked(false)}>{t('recreate')}</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input readOnly value={link} className="font-mono text-xs" />
              <Button
                variant="outline"
                size="icon"
                aria-label={t('copy')}
                onClick={() => toast.success(t('copied'))}
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                setRevoked(true);
                toast.success(t('revoked'));
              }}
            >
              <Ban className="size-4" />
              {t('revoke')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
