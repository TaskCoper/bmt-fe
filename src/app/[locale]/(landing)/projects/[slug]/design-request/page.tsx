import { DesignRequestForm } from '@/features/project'
import { type Locale } from '@/i18n'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export default async function ProjectDesignRequest({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className='mx-auto w-full max-w-7xl p-4'>
      <DesignRequestForm slug={slug} />
    </div>
  )
}
