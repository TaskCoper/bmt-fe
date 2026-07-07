'use client'

import { QUERY_KEY_ROOTS } from '@/shared/constants/query-keys'
import { mapService } from '@/shared/services/map.service'
import { useQuery } from '@tanstack/react-query'

export const useGetWards = (provinceCode: number) => {
  const { data: wards = [], isLoading: isLoadingWards } = useQuery({
    queryKey: [QUERY_KEY_ROOTS.location, 'wards', provinceCode],
    queryFn: () => mapService.getWards(provinceCode),
    enabled: provinceCode !== -1
  })

  return { wards, isLoadingWards }
}
