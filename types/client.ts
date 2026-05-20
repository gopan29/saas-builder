export type ClientPlan = 'starter' | 'standard' | 'premium'
export type ClientStatus = 'live' | 'staging' | 'paused'

export type Client = {
  id: string
  name: string
  industry: string
  domain: string
  plan: ClientPlan
  status: ClientStatus
  contracted_at: string
  mau: number
  notes: string | null
  created_at: string
  updated_at: string
}
