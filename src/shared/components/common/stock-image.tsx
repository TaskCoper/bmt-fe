import { cn } from '@/shared/lib/utils'
import { stockBeforeImage, stockImage } from '@/shared/lib/stock-images'

interface StockImageProps {
  /** Stable seed so the same item always resolves to the same photo. */
  seed: string | number
  alt: string
  /** Requested pixel width (Unsplash resizes on the fly). */
  width?: number
  /** Use a raw/unfinished "before" photo instead of a finished interior. */
  before?: boolean
  className?: string
}

/**
 * Real photo (Unsplash) for demo imagery — a near drop-in for the old
 * `ImagePlaceholder`. Uses a plain <img> so the browser fetches directly
 * (no next/image optimizer round-trip); swap for the CMS `<Image>` later.
 */
export function StockImage({ seed, alt, width, before = false, className }: StockImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- demo stock imagery, not app-managed assets
    <img
      src={before ? stockBeforeImage(seed, width) : stockImage(seed, width)}
      alt={alt}
      loading='lazy'
      className={cn('bg-muted object-cover', className)}
    />
  )
}
