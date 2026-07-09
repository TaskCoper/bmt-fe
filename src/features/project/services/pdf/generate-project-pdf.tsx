import type { PdfDocumentData } from './pdf-types'

/**
 * Generates a real PDF blob from `data` and triggers a browser download.
 * Dynamic-imports `@react-pdf/renderer` so its ~600 KB tree stays out of the
 * initial route bundle.
 */
export async function generateProjectPdf({
  data,
  fileName
}: {
  data: PdfDocumentData
  fileName: string
}): Promise<void> {
  const [{ pdf }, { ProjectProposalPdf }, { registerPdfFonts }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./project-proposal-pdf'),
    import('./pdf-fonts')
  ])

  registerPdfFonts()

  const blob = await pdf(<ProjectProposalPdf data={data} exportedAt={data.exportedAtLabel} />).toBlob()

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 5000)
}
