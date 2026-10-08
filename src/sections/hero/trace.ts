import type { LayerKind } from '@/data/types'
import type { SiteContent } from '@/i18n/types'

/**
 * The path of `POST /gyms/:gymId/check-ins` through Pulso's backend, step by
 * step, as it actually happens in the repository. The two scenarios share the
 * same pipeline; the "far" one fails inside the use case and the remaining
 * steps never run.
 */

export type Scenario = 'near' | 'far'
type Copy = SiteContent['inspector']
type StepId = keyof Copy['steps'] | 'distance'
type LayerLabel = keyof Copy['layers']

interface PipelineStep {
  id: StepId
  layer: LayerKind
  layerLabel: LayerLabel
  title: string
}

const pipeline: PipelineStep[] = [
  { id: 'request', layer: 'client', layerLabel: 'client', title: 'POST /gyms/:gymId/check-ins' },
  { id: 'auth', layer: 'edge', layerLabel: 'http', title: 'verifyJwt' },
  { id: 'validation', layer: 'edge', layerLabel: 'http', title: 'Zod' },
  { id: 'distance', layer: 'domain', layerLabel: 'domain', title: 'CheckInUseCase · distance' },
  { id: 'daily', layer: 'domain', layerLabel: 'domain', title: 'CheckInUseCase · one per day' },
  {
    id: 'repository',
    layer: 'data',
    layerLabel: 'data',
    title: 'PrismaCheckInsRepository.create',
  },
  { id: 'database', layer: 'data', layerLabel: 'data', title: 'INSERT INTO check_ins' },
]

const errorHandlerStep: PipelineStep = {
  id: 'errorHandler',
  layer: 'edge',
  layerLabel: 'http',
  title: 'errorHandler',
}

export const scenarios = {
  near: {
    distanceInMeters: 48,
    failAt: null,
    outcome: {
      status: '201 Created',
      body: `{
  "checkIn": {
    "id": "8f3c…e21a",
    "gym_id": "…",
    "validated_at": null
  }
}`,
    },
  },
  far: {
    distanceInMeters: 340,
    failAt: 'distance',
    // The API's real error message, untranslated on purpose.
    outcome: {
      status: '422 Unprocessable Entity',
      body: `{
  "message": "You must be within 100 meters
              of the gym to check in."
}`,
    },
  },
} satisfies Record<
  Scenario,
  {
    distanceInMeters: number
    failAt: StepId | null
    outcome: { status: string; body: string }
  }
>

export type StepState = 'ok' | 'failed' | 'skipped'

export interface ResolvedStep {
  id: StepId
  layer: LayerKind
  layerLabel: string
  title: string
  detail: string
  state: StepState
}

/** The ordered list of steps a scenario goes through, with their result. */
export function resolveTrace(scenario: Scenario, copy: Copy): ResolvedStep[] {
  const { failAt } = scenarios[scenario]
  const resolve = (step: PipelineStep, state: StepState): ResolvedStep => ({
    id: step.id,
    layer: step.layer,
    layerLabel: copy.layers[step.layerLabel],
    title: step.title,
    detail:
      step.id === 'distance'
        ? scenario === 'near'
          ? copy.distanceOk
          : copy.distanceFail
        : copy.steps[step.id],
    state,
  })

  const steps: ResolvedStep[] = []
  let failed = false

  for (const step of pipeline) {
    if (failed) {
      steps.push(resolve(step, 'skipped'))
    } else if (step.id === failAt) {
      failed = true
      steps.push(resolve(step, 'failed'))
    } else {
      steps.push(resolve(step, 'ok'))
    }
  }

  // The steps that never ran stay visible, dimmed, before the handler that
  // turns the domain error into a response.
  if (failed) steps.push(resolve(errorHandlerStep, 'ok'))

  return steps
}
