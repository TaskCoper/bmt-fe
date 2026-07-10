'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from 'react'
import { PROJECT_FLOW, getProjectFlowUrl, type ProjectFlowStep } from '../store/project.store'
import { TapeStepper, type TapeStep } from './tape-stepper'

interface ProjectFlowLayoutProps {
  slug: string
  children: ReactNode
}

interface FlowNavigationContextValue {
  registerBeforeNavigate: (cb: (() => void) | null) => void
}

const FlowNavigationContext = createContext<FlowNavigationContextValue | null>(null)

export function useFlowNavigation() {
  return useContext(FlowNavigationContext)
}

function stepFromPath(pathname: string, slug: string): number {
  const root = `/dashboard/projects/${slug}`
  if (!pathname.startsWith(root)) return 0
  const suffix = pathname.slice(root.length)
  const idx = PROJECT_FLOW.findIndex(([, path]) =>
    path === '' ? suffix === '' || suffix === '/' : suffix.startsWith(path)
  )
  return idx >= 0 ? idx : 0
}

export function ProjectFlowLayout({ slug, children }: ProjectFlowLayoutProps) {
  const t = useTranslations('project.form.steps')
  const tStepper = useTranslations('project.form.stepper')
  const pathname = usePathname()
  const router = useRouter()

  const beforeNavigateRef = useRef<(() => void) | null>(null)

  const registerBeforeNavigate = useCallback((cb: (() => void) | null) => {
    beforeNavigateRef.current = cb
  }, [])

  const steps: TapeStep[] = useMemo(() => PROJECT_FLOW.map(([key]) => ({ key, title: t(`${key}.label`) })), [t])

  const currentIndex = stepFromPath(pathname, slug)
  const total = steps.length

  const handleStepChange = (index: number) => {
    beforeNavigateRef.current?.()
    const entry = PROJECT_FLOW[index]
    if (!entry) return
    const [step] = entry as unknown as [ProjectFlowStep, string]
    router.push(getProjectFlowUrl(slug, step))
  }

  return (
    <FlowNavigationContext.Provider value={{ registerBeforeNavigate }}>
      <div className='space-y-2'>
        <TapeStepper
          steps={steps}
          current={currentIndex}
          onStepChange={handleStepChange}
          ariaLabel={tStepper('ariaLabel', { current: currentIndex + 1, total })}
        />

        <div>{children}</div>
      </div>
    </FlowNavigationContext.Provider>
  )
}
