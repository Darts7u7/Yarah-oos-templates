import { useQuery } from '@tanstack/react-query'
import { yarah } from '@/lib/yarah'

export type Workspace = {
  id: string
  slug: string
  name: string
  owner_id: string
  created_at: string
}

export type WorkspaceMembership = Workspace & { role: 'owner' | 'admin' | 'member' }

export function useWorkspaces(userId: string | undefined) {
  return useQuery({
    enabled: !!userId,
    queryKey: ['workspaces', userId],
    queryFn: async (): Promise<WorkspaceMembership[]> => {
      const { data: members, error: memErr } = await yarah.database
        .from('workspace_members')
        .select('workspace_id, role')
        .eq('user_id', userId!)
      if (memErr) throw new Error(memErr.message)
      const memberRows = (members ?? []) as Array<{ workspace_id: string; role: WorkspaceMembership['role'] }>
      if (memberRows.length === 0) return []

      const ids = memberRows.map((r) => r.workspace_id)
      const { data: wsRows, error: wsErr } = await yarah.database
        .from('workspaces')
        .select('id, slug, name, owner_id, created_at')
        .in('id', ids)
      if (wsErr) throw new Error(wsErr.message)
      const wsList = (wsRows ?? []) as Workspace[]
      const byId = new Map(wsList.map((w) => [w.id, w]))

      return memberRows
        .map((r) => {
          const ws = byId.get(r.workspace_id)
          return ws ? ({ ...ws, role: r.role } as WorkspaceMembership) : null
        })
        .filter((x): x is WorkspaceMembership => x !== null)
    },
  })
}
