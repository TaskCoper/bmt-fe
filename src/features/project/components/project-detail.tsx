'use client'

import { Link } from '@/i18n'
import { Button } from '@/shared/components/ui'
import { useProjectStore } from '../store/project.store'

interface ProjectDetailProps {
  slug: string
}

const STEP_HREFS: Record<number, string> = {
  2: 'design-request'
}

export default function ProjectDetail({ slug }: ProjectDetailProps) {
  const projects = useProjectStore((s) => s.projects)

  const project = projects[slug]

  if (!project) {
    return <p>Không tìm thấy dự án</p>
  }

  const url = `/projects/${project.slug}/${STEP_HREFS[project.step]}`

  return (
    <div>
      <p className='font-semibold text-2xl'>{project.name}</p>
      <p className='text-muted-foreground text-sm'>{project.description}</p>

      <Button asChild>
        <Link href={url}>Tiếp tục</Link>
      </Button>
    </div>
  )
}
