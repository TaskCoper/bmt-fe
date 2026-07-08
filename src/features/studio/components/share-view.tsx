'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { AmbientAura } from '@/shared/components/common'
import { useWizardStore } from '../store/wizard.store'
import { PdfPreview } from './pdf-preview'

/** Public, login-free proposal view rendered from a share token (mock). */
export function ShareView({ token }: { token: string }) {
  const t = useTranslations('studio.sharePage')
  const tg = useTranslations('studio.guard')
  const project = useWizardStore((s) => s.projects[token])
  const openProject = useWizardStore((s) => s.openProject)

  useEffect(() => {
    openProject(token)
  }, [token, openProject])

  if (!project) {
    return (
      <div className="relative min-h-screen">
        <AmbientAura />
        <div className="relative mx-auto flex min-h-screen max-w-lg items-center px-4 py-24">
          <div className="glass-panel w-full p-10 text-center">
            <p className="text-lg font-semibold tracking-tight">
              {tg('missing')}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {tg('missingHint')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <AmbientAura />
      <div className="relative mx-auto max-w-2xl px-4 py-10">
        <div className="glass-panel-strong space-y-6 p-6 sm:p-8">
          <header className="border-glass-border flex items-center gap-3 border-b pb-6">
            <div className="border-primary/25 from-primary/25 to-primary/5 text-primary flex size-12 items-center justify-center rounded-xl border bg-gradient-to-br text-lg font-bold shadow-sm">
              BMT
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {t('heading', { name: project.data.name })}
              </h1>
              <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
            </div>
          </header>

          <PdfPreview project={project} />

          <footer className="text-muted-foreground border-glass-border border-t pt-6 text-center text-sm">
            <p className="font-medium">{t('madeBy')}</p>
            <p>{t('contact')}</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
