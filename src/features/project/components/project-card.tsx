'use client'

import { Link } from '@/i18n/navigation'
import { Button, Card } from '@/shared/components/ui'
import { GlassCard } from '@/shared/components/ui/glasscn/glass-card'
import { EllipsisIcon, TextIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import appartmentDark from 'public/images/appartment-dark.png'
import appartmentLight from 'public/images/appartment-light.png'
import townhouseDark from 'public/images/townhouse-dark.png'
import townhouseLight from 'public/images/townhouse-light.png'
import villaDark from 'public/images/villa-dark.png'
import villaLight from 'public/images/villa-light.png'
import { useProjectStore, type ProjectDraft } from '../store/project.store'
import { HouseType } from '../types/project.types'
import ProjectCardActions from './project-card-actions'

const HOUSE_IMAGES = {
  [HouseType.Appartment]: { dark: appartmentDark, light: appartmentLight },
  [HouseType.Townhouse]: { dark: townhouseDark, light: townhouseLight },
  [HouseType.Villa]: { dark: villaDark, light: villaLight }
} as const

interface ProjectCardProps {
  project: ProjectDraft
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations('project.card')
  const removeProject = useProjectStore((s) => s.removeProject)

  const imageSet = HOUSE_IMAGES[project.houseType]
  const alt = t(`imageAlt.${project.houseType}`)

  return (
    <Link href={`/dashboard/projects/${project.slug}`} className='block'>
      <Card className='relative aspect-video overflow-hidden'>
        <ProjectCardActions onDelete={() => removeProject(project.slug)}>
          <Button
            className='absolute z-10 top-2 right-2'
            variant='ghost'
            size='icon-sm'
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <EllipsisIcon />
          </Button>
        </ProjectCardActions>

        <Image
          src={imageSet.light}
          alt={alt}
          fill
          className='object-cover dark:hidden'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        />

        <Image
          src={imageSet.dark}
          alt={alt}
          fill
          className='hidden object-cover dark:block'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        />

        <div
          aria-hidden
          className='absolute inset-0 bg-linear-to-t from-black/15 via-black/0 to-white/5 dark:from-black/45 dark:via-black/10 dark:to-white/0'
        />

        <GlassCard
          surfaceClassName='rounded-t-none rounded-b-sm absolute inset-x-0 bottom-0 shadow-[0_-10px_34px_rgba(13,14,17,0.18)] dark:shadow-[0_-10px_34px_rgba(0,0,0,0.55)]'
          liquidProps={{
            blur: 5,
            saturation: 1.42,
            style: {
              '--liquid-glass-rim-light': 'color-mix(in oklch, var(--primary) 52%, transparent)',
              '--liquid-glass-rim-dark': 'rgba(13, 14, 17, 0.24)'
            } as React.CSSProperties
          }}
          className='gap-0 p-2'
        >
          <p className='mb-1 text-sm font-semibold text-white'>{project.name}</p>

          {project.description ? (
            <div className='flex items-center gap-1.5 text-white/80'>
              <TextIcon className='size-3' />
              <p className='truncate text-xs'>{project.description}</p>
            </div>
          ) : null}
        </GlassCard>
      </Card>
    </Link>
  )
}
