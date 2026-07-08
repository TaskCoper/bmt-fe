'use client'

import { Link } from '@/i18n'
import { Button } from '@/shared/components/ui'
import { useProjectStore, useSetProjectFlow } from '../store/project.store'

interface ProjectDetailProps {
  slug: string
}

export default function ProjectDetail({ slug }: ProjectDetailProps) {
  const projects = useProjectStore((s) => s.projects)

  useSetProjectFlow(slug, 'detail')

  const project = projects[slug]

  if (!project) {
    return <p>Không tìm thấy dự án</p>
  }

  return (
    <div>
      <p className='font-semibold text-2xl'>{project.name}</p>
      <p className='text-muted-foreground text-sm'>{project.description}</p>

      {project.nextUrl && (
        <Button asChild>
          <Link href={project.nextUrl}>Tiếp tục</Link>
        </Button>
      )}
    </div>
  )
}
