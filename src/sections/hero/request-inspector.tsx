'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'

import { useAchievements } from '@/components/achievements/achievements-provider'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useI18n } from '@/i18n/i18n-provider'
import styles from './request-inspector.module.css'
import { resolveTrace, scenarios, type ResolvedStep, type Scenario } from './trace'

type View = 'interface' | 'inside'

const STEP_INTERVAL_MS = 340
const SKIPPED_STEP_INTERVAL_MS = 90

const USE_CASE_URL =
  'https://github.com/gustavosantana-034/GYM-API/blob/main/backend/src/use-cases/check-in-use-case.ts'

const views: View[] = ['interface', 'inside']

export function RequestInspector() {
  const [view, setView] = useState<View>('interface')
  const [scenario, setScenario] = useState<Scenario>('near')
  const [runId, setRunId] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState(0)
  const reduceMotion = useReducedMotion()
  const { t } = useI18n()
  const copy = t.inspector
  const { unlock } = useAchievements()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const steps = useMemo(() => resolveTrace(scenario, copy), [scenario, copy])
  const shownSteps = reduceMotion ? steps.length : visibleSteps
  const finished = shownSteps >= steps.length
  const outcome = scenarios[scenario].outcome
  const succeeded = scenarios[scenario].failAt === null

  // Plays the trace one step at a time every time a new run starts.
  useEffect(() => {
    if (view !== 'inside' || reduceMotion) return

    const timers: number[] = []
    let elapsed = 200

    steps.forEach((step, index) => {
      elapsed += step.state === 'skipped' ? SKIPPED_STEP_INTERVAL_MS : STEP_INTERVAL_MS
      timers.push(window.setTimeout(() => setVisibleSteps(index + 1), elapsed))
    })

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [view, runId, steps, reduceMotion])

  useEffect(() => {
    if (!finished || view !== 'inside') return
    unlock('inspector')
    if (!succeeded) unlock('unhappy-path')
  }, [finished, view, succeeded, unlock])

  function run(nextScenario: Scenario = scenario) {
    setVisibleSteps(0)
    setScenario(nextScenario)
    setView('inside')
    setRunId((id) => id + 1)
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const nextIndex = (index + (event.key === 'ArrowRight' ? 1 : -1) + views.length) % views.length
    const next = views[nextIndex]
    if (!next) return
    setView(next)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={styles.inspector}>
      <div className={styles.chrome}>
        <div
          role="tablist"
          aria-label={copy.tabsLabel}
          className={styles.tabs}
          data-selected={views.indexOf(view)}
        >
          <span className={styles.tabIndicator} aria-hidden="true" />
          {views.map((item, index) => (
            <button
              key={item}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`inspector-tab-${item}`}
              aria-selected={view === item}
              aria-controls="inspector-panel"
              tabIndex={view === item ? 0 : -1}
              className={styles.tab}
              onClick={() => (item === 'inside' && view !== 'inside' ? run() : setView(item))}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span className={styles.tabLabel}>{copy.tabs[item]}</span>
            </button>
          ))}
        </div>
        <span className={styles.badge}>{copy.badge}</span>
      </div>

      <div
        id="inspector-panel"
        role="tabpanel"
        aria-labelledby={`inspector-tab-${view}`}
        className={styles.panel}
      >
        {/* Keyed so each view replays the CSS entrance when it mounts. */}
        {view === 'interface' ? (
          <div key="interface" className={styles.view}>
            <ProductPreview
              scenario={scenario}
              onScenarioChange={setScenario}
              onCheckIn={() => run()}
            />
          </div>
        ) : (
          <div key="inside" className={styles.view}>
            <TraceView
              key={runId}
              steps={steps}
              visibleSteps={shownSteps}
              outcome={finished ? outcome : null}
              succeeded={succeeded}
            />
            <div className={styles.actions}>
              <button type="button" className={styles.action} onClick={() => run()}>
                <span aria-hidden="true">↻</span> {copy.rerun}
              </button>
              <button
                type="button"
                className={styles.action}
                onClick={() => run(scenario === 'near' ? 'far' : 'near')}
              >
                {scenario === 'near' ? copy.tryFar : copy.tryNear}
              </button>
              <button
                type="button"
                className={`${styles.action} ${styles.actionQuiet}`}
                onClick={() => setView('interface')}
              >
                <span aria-hidden="true">←</span> {copy.backToInterface}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className={styles.footnote}>
        {copy.footnote[0]}
        <a href={USE_CASE_URL} target="_blank" rel="noreferrer">
          {copy.footnote[1]}
          <span className="visually-hidden">{copy.footnoteHidden}</span>
        </a>
        {copy.footnote[2]}
      </p>
    </div>
  )
}

function ProductPreview({
  scenario,
  onScenarioChange,
  onCheckIn,
}: {
  scenario: Scenario
  onScenarioChange: (scenario: Scenario) => void
  onCheckIn: () => void
}) {
  const { t } = useI18n()
  const copy = t.inspector
  const { distanceInMeters } = scenarios[scenario]
  const near = scenario === 'near'

  return (
    <div className={styles.product}>
      <div className={styles.appBar}>
        <span className={styles.appBrand}>
          <span className={styles.appBrandDot} aria-hidden="true" />
          Pulso
        </span>
        <span className={styles.appMeta}>{copy.appMeta}</span>
      </div>

      <div className={styles.gym}>
        <DistanceRings near={near} />
        <div className={styles.gymInfo}>
          <p className={styles.gymName}>Iron House</p>
          <p className={styles.gymAddress}>{copy.gymAddress}</p>
          <ul role="list" className={styles.chips}>
            {copy.modalities.map((modality) => (
              <li key={modality}>{modality}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className={styles.distance} data-near={near}>
        {copy.youAreAt} <strong>{distanceInMeters} m</strong>
        {near ? copy.distanceNear : copy.distanceFar}
      </p>

      <button type="button" className={styles.checkIn} onClick={onCheckIn}>
        {copy.checkIn}
        <span aria-hidden="true">→</span>
      </button>

      <fieldset className={styles.scenario}>
        <legend>{copy.positionLegend}</legend>
        {(['near', 'far'] as const).map((option) => (
          <label key={option} className={styles.scenarioOption}>
            <input
              type="radio"
              name="inspector-scenario"
              value={option}
              checked={scenario === option}
              onChange={() => onScenarioChange(option)}
            />
            <span>
              {option === 'near' ? copy.near : copy.far} · {scenarios[option].distanceInMeters} m
            </span>
          </label>
        ))}
      </fieldset>

      {!near && <p className={styles.note}>{copy.note}</p>}

      <dl className={styles.stats}>
        {copy.stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function DistanceRings({ near }: { near: boolean }) {
  return (
    <svg className={styles.rings} viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="44" className={styles.ringOuter} />
      <circle cx="48" cy="48" r="26" className={styles.ringLimit} />
      <circle cx="48" cy="48" r="5" className={styles.ringGym} />
      <circle
        className={styles.ringUser}
        cx="48"
        cy="48"
        r="4"
        style={{ transform: near ? 'translate(13px, -9px)' : 'translate(-33px, 24px)' }}
      />
    </svg>
  )
}

function TraceView({
  steps,
  visibleSteps,
  outcome,
  succeeded,
}: {
  steps: ResolvedStep[]
  visibleSteps: number
  outcome: { status: string; body: string } | null
  succeeded: boolean
}) {
  const { t } = useI18n()
  const copy = t.inspector

  return (
    <div className={styles.trace}>
      <ol className={styles.steps} aria-label={copy.stepsLabel}>
        {steps.map((step, index) => {
          const visible = index < visibleSteps
          return (
            <li
              key={step.id}
              className={styles.step}
              data-state={step.state}
              data-layer={step.layer}
              data-visible={visible}
              aria-hidden={!visible}
            >
              <span className={styles.layer}>{step.layerLabel}</span>
              <span className={styles.stepBody}>
                <span className={styles.stepTitle}>{step.title}</span>
                <span className={styles.stepDetail}>
                  {step.state === 'skipped' ? copy.notExecuted : step.detail}
                </span>
              </span>
              <span className={styles.stepStatus} aria-hidden="true">
                {visible ? statusGlyph(step.state) : ''}
              </span>
              <span className="visually-hidden">{visible ? copy.status[step.state] : ''}</span>
            </li>
          )
        })}
      </ol>

      <div className={styles.outcome} data-ok={succeeded} aria-live="polite">
        {outcome ? (
          <div className={styles.response}>
            <p className={styles.status}>HTTP/1.1 {outcome.status}</p>
            <pre className={styles.body}>{outcome.body}</pre>
          </div>
        ) : (
          <p className={styles.waiting}>
            {copy.waiting}
            <span className={styles.ellipsis} aria-hidden="true" />
          </p>
        )}
      </div>
    </div>
  )
}

function statusGlyph(state: ResolvedStep['state']) {
  if (state === 'ok') return '✓'
  if (state === 'failed') return '✕'
  return '–'
}
