import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui'
import { TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ProjectCardActionsProps {
  children: React.ReactNode
  onDelete: () => void
}

export default function ProjectCardActions({ children, onDelete }: ProjectCardActionsProps) {
  const t = useTranslations('project.card.actions')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          variant='destructive'
          onClick={(e) => {
            e.preventDefault()
            onDelete()
          }}
        >
          <TrashIcon />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
