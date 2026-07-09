import { ProjectDesignRequest } from '@/features/project'
import { type Locale } from '@/i18n'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function ProjectDesignRequestPage({ params }: PageProps) {
  const { slug } = await params

  return <ProjectDesignRequest slug={slug} />
}
