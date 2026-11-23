import type { CSSProperties, ReactNode } from 'react'

import { Skeleton } from '../Skeleton'
import { Tooltip } from '../Tooltip'
import './Progress.css'

export interface ProgressSegment {
  /** Amount of this segment (in the same units as `max`). Segments are stacked in order. */
  value: number
  /** `solid` — confirmed / final data; `hatch` — preliminary data (readable without color). @default 'solid' */
  fill?: 'solid' | 'hatch'
  /** Custom color, e.g. `var(--ot-color-chart-2)`. Defaults to `data/confirmed` (solid) or `data/preliminary` (hatch). */
  color?: string
  /** Name for the legend, tooltip and accessible description, e.g. "Confirmed 32.1M". */
  label: string
}

export interface ProgressMarker {
  /** Position on the scale. */
  value: number
  /** `target` — full-height goal line; `marker` — line with a triangle on top (expected, today). @default 'target' */
  type?: 'target' | 'marker'
  /** Label above the bar and in the legend, e.g. "Goal 48.0M". */
  label: string
}

export interface ProgressProps {
  /** Scale maximum. Can exceed the goal so overdelivery fits (e.g. goal 100, max 120). @default 100 */
  max?: number
  /** Stacked segments (Figma solid / hatch). Empty = Empty state: only track and markers. */
  segments?: ProgressSegment[]
  /** Value markers: targets and expected values. */
  markers?: ProgressMarker[]
  /** Dashed ghost segment for a forecast, from `from` to `to` on the scale. */
  ghost?: { from: number; to: number; label: string }
  /** Bar height (Figma `Size`): `sm` 8 · `md` 12 · `lg` 16. @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Top-left label (Figma `Label`), e.g. "Delivered 36.2M". */
  label?: ReactNode
  /** Top-right caption (Figma `Caption`), e.g. "Goal 48.0M". */
  caption?: ReactNode
  /** Shows labels of markers above the bar (Figma `Show marker labels`). @default true */
  showMarkerLabels?: boolean
  /** Shows the legend under the bar (Figma `Show legend`). Keep it on unless the meaning is given nearby. @default true */
  showLegend?: boolean
  /** Muted look for inactive entities (Figma `State=Muted`). @default false */
  muted?: boolean
  /** Skeleton of the same height (Figma `State=Loading`). @default false */
  loading?: boolean
  /** Makes segments focusable with a Tooltip and hover highlight (Figma `State=Hover/Focus`). @default false */
  interactive?: boolean
  /** Full accessible description with the numbers, e.g. "Delivered 36.2M of 48.0M goal: 32.1M confirmed, 4.1M preliminary". Built automatically when omitted. */
  ariaLabel?: string
  /** Extra class names. */
  className?: string
}

/** Targets read to the right of their line, markers (expected, today) to the left, flipped near the edges so close pairs don't collide. */
const labelSide = (m: ProgressMarker, max: number) => {
  const r = m.value / max
  if ((m.type ?? 'target') === 'target') return r > 0.8 ? 'end' : 'start'
  return r < 0.2 ? 'start' : 'end'
}

const pct = (v: number, max: number) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`

/**
 * Horizontal segmented meter: solid (confirmed) and hatch (preliminary) segments on a track, an optional dashed
 * forecast, target / expected markers and a legend. `role="meter"` for a single value, otherwise `role="img"`
 * (or a group of focusable segments when `interactive`).
 */
export function Progress({
  max = 100,
  segments = [],
  markers = [],
  ghost,
  size = 'md',
  label,
  caption,
  showMarkerLabels = true,
  showLegend = true,
  muted = false,
  loading = false,
  interactive = false,
  ariaLabel,
  className,
}: ProgressProps) {
  const classes = ['ot-progress', `ot-progress--${size}`, muted && 'ot-progress--muted', interactive && 'ot-progress--interactive', className].filter(Boolean).join(' ')
  if (loading) {
    return (
      <div className={classes} aria-busy="true" aria-label="Loading progress">
        <Skeleton size="sm" width={160} />
        <Skeleton shape="block" height="var(--_h)" />
        <Skeleton size="sm" width={240} />
      </div>
    )
  }
  const placed = segments.map((s, i) => ({ ...s, start: segments.slice(0, i).reduce((sum, p) => sum + p.value, 0) }))
  const description =
    ariaLabel ??
    [
      typeof label === 'string' ? label : '',
      placed.map(s => s.label).join(', '),
      ghost?.label,
      markers.map(m => m.label).join(', '),
    ]
      .filter(Boolean)
      .join('. ')
  const single = segments.length === 1 && markers.length === 0 && !ghost && !interactive
  const role = single
    ? { role: 'meter', 'aria-valuenow': segments[0].value, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-label': description }
    : interactive
      ? { role: 'group', 'aria-label': description }
      : { role: 'img', 'aria-label': description }

  return (
    <div className={classes}>
      {(label || caption) && (
        <div className="ot-progress__labels" aria-hidden="true">
          {label && <span className="ot-progress__label">{label}</span>}
          {caption && <span className="ot-progress__caption">{caption}</span>}
        </div>
      )}
      <div className="ot-progress__plot" {...role}>
        {showMarkerLabels && markers.length > 0 && (
          <div className="ot-progress__marker-labels" aria-hidden="true">
            {markers.map((m, i) => (
              <span key={i} className={`ot-progress__marker-label ot-progress__marker-label--${m.type ?? 'target'} ot-progress__marker-label--${labelSide(m, max)}`} style={{ left: pct(m.value, max) }}>{m.label}</span>
            ))}
          </div>
        )}
        <div className="ot-progress__bar">
          <div className="ot-progress__track">
            {placed.map((s, i) => {
              const style = {
                left: `calc(${pct(s.start, max)} + ${i ? 'var(--ot-progress-segment-gap)' : '0px'})`,
                width: `calc(${pct(s.value, max)} - ${i ? 'var(--ot-progress-segment-gap)' : '0px'})`,
                ...(s.color ? { '--_c': s.color } : {}),
              } as CSSProperties
              const cls = `ot-progress__segment ot-progress__segment--${s.fill ?? 'solid'}`
              return interactive ? (
                <Tooltip key={i} variant="light" title={s.label} anchorStyle={style}>
                  <button type="button" className={cls} aria-label={s.label} />
                </Tooltip>
              ) : (
                <span key={i} className={cls} style={style} aria-hidden="true" />
              )
            })}
            {ghost && <span className="ot-progress__ghost" style={{ left: `calc(${pct(ghost.from, max)} + var(--ot-progress-segment-gap))`, width: `calc(${pct(ghost.to - ghost.from, max)} - var(--ot-progress-segment-gap))` }} aria-hidden="true" />}
          </div>
          {markers.map((m, i) => (
            <span key={i} className={`ot-progress__marker ot-progress__marker--${m.type ?? 'target'}`} style={{ left: pct(m.value, max) }} aria-hidden="true" />
          ))}
        </div>
      </div>
      {showLegend && (placed.length > 0 || markers.length > 0 || ghost) && (
        <ul className="ot-progress__legend" aria-hidden="true">
          {placed.map((s, i) => (
            <li key={`s${i}`} className="ot-progress__legend-item">
              <span className={`ot-progress__swatch ot-progress__swatch--${s.fill ?? 'solid'}`} style={s.color ? ({ '--_c': s.color } as CSSProperties) : undefined} />
              <span className="ot-progress__legend-label">{s.label}</span>
            </li>
          ))}
          {ghost && (
            <li className="ot-progress__legend-item">
              <span className="ot-progress__swatch ot-progress__swatch--ghost" />
              <span className="ot-progress__legend-label">{ghost.label}</span>
            </li>
          )}
          {markers.map((m, i) => (
            <li key={`m${i}`} className="ot-progress__legend-item">
              <span className={`ot-progress__swatch ot-progress__swatch--${m.type ?? 'target'}`} />
              <span className="ot-progress__legend-label">{m.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
