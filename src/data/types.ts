export type LayerKind = 'client' | 'edge' | 'application' | 'domain' | 'data' | 'external'

export interface FlowNode {
  label: string
  detail: string
  kind: LayerKind
}
