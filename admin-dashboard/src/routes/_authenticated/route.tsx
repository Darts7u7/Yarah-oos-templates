import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { yarah } from '@/lib/yarah'
import { AppShell } from '@/components/layout/app-shell'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const { data } = await yarah.auth.getCurrentUser()
    if (!data?.user) throw redirect({ to: '/sign-in' })
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
