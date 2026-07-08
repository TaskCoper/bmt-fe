'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/components/ui/popover'
import { LANDING_SECTIONS } from '../constants/landing.constants'

interface SearchEntry {
  /** `t()` path resolving the display label. */
  labelKey: string
  /** In-page anchor target. */
  href: string
  /** Short scope label key (e.g. service / project / page). */
  scopeKey: string
}

/**
 * Static search index spanning public content (pages, services, portfolio).
 * Scope mirrors the confirmed scope: static pages + portfolio + library.
 */
const ENTRIES: readonly SearchEntry[] = [
  {
    labelKey: 'nav.services',
    href: `#${LANDING_SECTIONS.services}`,
    scopeKey: 'page'
  },
  {
    labelKey: 'nav.process',
    href: `#${LANDING_SECTIONS.process}`,
    scopeKey: 'page'
  },
  {
    labelKey: 'nav.projects',
    href: `#${LANDING_SECTIONS.projects}`,
    scopeKey: 'page'
  },
  {
    labelKey: 'nav.about',
    href: `#${LANDING_SECTIONS.about}`,
    scopeKey: 'page'
  },
  {
    labelKey: 'nav.contact',
    href: `#${LANDING_SECTIONS.contact}`,
    scopeKey: 'page'
  },
  {
    labelKey: 'services.consult.title',
    href: `#${LANDING_SECTIONS.services}`,
    scopeKey: 'service'
  },
  {
    labelKey: 'services.estimate.title',
    href: `#${LANDING_SECTIONS.services}`,
    scopeKey: 'service'
  },
  {
    labelKey: 'services.design.title',
    href: `#${LANDING_SECTIONS.services}`,
    scopeKey: 'service'
  },
  {
    labelKey: 'services.manage.title',
    href: `#${LANDING_SECTIONS.services}`,
    scopeKey: 'service'
  },
  {
    labelKey: 'services.library.title',
    href: `#${LANDING_SECTIONS.services}`,
    scopeKey: 'service'
  },
  {
    labelKey: 'services.support.title',
    href: `#${LANDING_SECTIONS.services}`,
    scopeKey: 'service'
  },
  {
    labelKey: 'projects.item1.name',
    href: `#${LANDING_SECTIONS.projects}`,
    scopeKey: 'project'
  },
  {
    labelKey: 'projects.item2.name',
    href: `#${LANDING_SECTIONS.projects}`,
    scopeKey: 'project'
  },
  {
    labelKey: 'projects.item3.name',
    href: `#${LANDING_SECTIONS.projects}`,
    scopeKey: 'project'
  }
]

const MAX_RESULTS = 5

/** Public site search with top-5 autocomplete suggestions (Q&A §3.3.2). */
export function SiteSearch() {
  const t = useTranslations('landing')
  const tSearch = useTranslations('landing.search')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return ENTRIES.map((e) => ({
      ...e,
      label: t(e.labelKey as Parameters<typeof t>[0])
    }))
      .filter((e) => e.label.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
  }, [query, t])

  const open = query.trim().length > 0

  return (
    <Popover open={open}>
      <PopoverAnchor asChild>
        <div className='relative w-full max-w-xs'>
          <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2' />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tSearch('placeholder')}
            aria-label={tSearch('placeholder')}
            className='h-9 pl-8'
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align='start'
        onOpenAutoFocus={(e) => e.preventDefault()}
        className='w-(--radix-popover-trigger-width) p-1'
      >
        {results.length === 0 ? (
          <p className='text-muted-foreground px-3 py-2 text-sm'>{tSearch('empty')}</p>
        ) : (
          <ul>
            {results.map((r) => (
              <li key={r.labelKey}>
                <a
                  href={r.href}
                  onClick={() => setQuery('')}
                  className={cn('hover:bg-accent flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm')}
                >
                  <span className='truncate'>{r.label}</span>
                  <span className='text-muted-foreground shrink-0 text-xs'>
                    {tSearch(`scope.${r.scopeKey}` as Parameters<typeof tSearch>[0])}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
