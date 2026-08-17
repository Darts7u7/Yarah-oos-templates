import { createFileRoute, redirect } from '@tanstack/react-router'
import { yarah } from '@/lib/yarah'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data } = await yarah.auth.getCurrentUser()
    if (data?.user) throw redirect({ to: '/dashboard' })
    throw redirect({ to: '/sign-in' })
  },
})
