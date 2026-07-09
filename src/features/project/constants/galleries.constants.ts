/**
 * Mock render images for the Step 5 gallery. Each entry maps to a real
 * Unsplash photo picked to look like an interior/exterior render so the
 * demo is convincing without needing a real render pipeline.
 */
export type GalleryRoom = 'living' | 'kitchen' | 'dining' | 'bedroom' | 'bathroom' | 'exterior'

export type GalleryFloor = 'ground' | 'upper1' | 'upper2' | 'exterior'

export interface GalleryImage {
  id: string
  /** Unsplash photo id — served as a plain <img> to avoid remotePattern config. */
  photoId: string
  room: GalleryRoom
  floor: GalleryFloor
  /** Aspect hint used to bias masonry rows. */
  aspect: 'portrait' | 'landscape' | 'square'
}

const UNSPLASH_BASE = 'https://images.unsplash.com'

/** Curated interior/exterior render-alike photos. */
export const GALLERY_IMAGES: readonly GalleryImage[] = [
  // Living room
  { id: 'living-1', photoId: 'photo-1600585154340-be6161a56a0c', room: 'living', floor: 'ground', aspect: 'landscape' },
  { id: 'living-2', photoId: 'photo-1618221195710-dd6b41faaea6', room: 'living', floor: 'ground', aspect: 'square' },
  { id: 'living-3', photoId: 'photo-1555041469-a586c61ea9bc', room: 'living', floor: 'upper1', aspect: 'landscape' },
  { id: 'living-4', photoId: 'photo-1493809842364-78817add7ffb', room: 'living', floor: 'upper1', aspect: 'portrait' },
  // Kitchen
  {
    id: 'kitchen-1',
    photoId: 'photo-1600585154526-990dced4db0d',
    room: 'kitchen',
    floor: 'ground',
    aspect: 'landscape'
  },
  { id: 'kitchen-2', photoId: 'photo-1556909114-f6e7ad7d3136', room: 'kitchen', floor: 'ground', aspect: 'square' },
  {
    id: 'kitchen-3',
    photoId: 'photo-1584622650111-993a426fbf0a',
    room: 'kitchen',
    floor: 'upper1',
    aspect: 'portrait'
  },
  // Dining
  { id: 'dining-1', photoId: 'photo-1616486338812-3dadae4b4ace', room: 'dining', floor: 'ground', aspect: 'portrait' },
  { id: 'dining-2', photoId: 'photo-1555396273-367ea4eb4db5', room: 'dining', floor: 'ground', aspect: 'landscape' },
  // Bedroom
  {
    id: 'bedroom-1',
    photoId: 'photo-1600607687939-ce8a6c25118c',
    room: 'bedroom',
    floor: 'upper1',
    aspect: 'landscape'
  },
  {
    id: 'bedroom-2',
    photoId: 'photo-1600585152220-90363fe7e115',
    room: 'bedroom',
    floor: 'upper2',
    aspect: 'landscape'
  },
  {
    id: 'bedroom-3',
    photoId: 'photo-1507652313519-d4e9174996dd',
    room: 'bedroom',
    floor: 'upper1',
    aspect: 'portrait'
  },
  { id: 'bedroom-4', photoId: 'photo-1540518614846-7eded433c457', room: 'bedroom', floor: 'upper2', aspect: 'square' },
  // Bathroom
  {
    id: 'bathroom-1',
    photoId: 'photo-1600566753190-17f0baa2a6c3',
    room: 'bathroom',
    floor: 'upper1',
    aspect: 'portrait'
  },
  {
    id: 'bathroom-2',
    photoId: 'photo-1552321554-5fefe8c9ef14',
    room: 'bathroom',
    floor: 'upper2',
    aspect: 'landscape'
  },
  {
    id: 'bathroom-3',
    photoId: 'photo-1600566752355-35792bedcfea',
    room: 'bathroom',
    floor: 'upper1',
    aspect: 'square'
  },
  // Exterior
  {
    id: 'exterior-1',
    photoId: 'photo-1600585154363-67eb9e2e2099',
    room: 'exterior',
    floor: 'exterior',
    aspect: 'landscape'
  },
  {
    id: 'exterior-2',
    photoId: 'photo-1600607688969-a5bfcd646154',
    room: 'exterior',
    floor: 'exterior',
    aspect: 'portrait'
  },
  {
    id: 'exterior-3',
    photoId: 'photo-1570129477492-45c003edd2be',
    room: 'exterior',
    floor: 'exterior',
    aspect: 'landscape'
  },
  {
    id: 'exterior-4',
    photoId: 'photo-1512917774080-9991f1c4c750',
    room: 'exterior',
    floor: 'exterior',
    aspect: 'square'
  }
] as const

export function galleryImageUrl(image: GalleryImage, width = 900): string {
  return `${UNSPLASH_BASE}/${image.photoId}?auto=format&fit=crop&w=${width}&q=80`
}

export const GALLERY_ROOMS: readonly GalleryRoom[] = [
  'living',
  'kitchen',
  'dining',
  'bedroom',
  'bathroom',
  'exterior'
] as const
