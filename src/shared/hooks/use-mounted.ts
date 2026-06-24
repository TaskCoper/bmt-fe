'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `true` after the component has mounted on the client.
 * Use to defer rendering theme/locale-dependent UI and avoid hydration
 * mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
