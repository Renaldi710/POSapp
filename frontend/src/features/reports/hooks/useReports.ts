import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import client from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { DailyReport } from '../../../api/types'

// ponytail: backend belum punya endpoint /api/reports/daily — 404 akan return null
export function useDailyReport(date: string) {
  return useQuery({
    queryKey: ['daily-report', date],
    queryFn: async () => {
      try {
        const res = await client.get<DailyReport>(ENDPOINTS.REPORTS.DAILY, { params: { date } })
        return res.data
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) return null
        throw err
      }
    },
    staleTime: 60 * 1000,
  })
}
