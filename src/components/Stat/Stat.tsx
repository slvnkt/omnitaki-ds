import { ArrowDown, ArrowRight, ArrowUp, CaretRight, Info } from '@phosphor-icons/react'
import { useId, type MouseEventHandler, type ReactNode } from 'react'

import { Skeleton } from '../Skeleton'
import { Tooltip } from '../Tooltip'
import './Stat.css'

export type DeltaDirection = 'up' | 'down' | 'flat'
export type DeltaIntent = 'success' | 'danger' | 'neutral'
export type StatSize = 'sm' | 'md' | 'lg'

export interface DeltaProps {
  /** Change value with sign, e.g. "+12%" or "−4%". */
  value: ReactNode
  /** Arrow direction (Figma `Direction`). @default 'up' */
  direction?: DeltaDirection
  /** Color by meaning, not by direction (Figma `Intent`): "more" is not always "better". @default 'neutral' */
  intent?: DeltaIntent
  /** Comparison text (Figma `Comparison`), e.g. "vs last week". */
  comparison?: ReactNode
  /** Extra class names. */
  className?: string
}

const ARROWS: Record<DeltaDirection, ReactNode> = { up: <ArrowUp weight="bold" />, down: <ArrowDown weight="bold" />, flat: <ArrowRight weight="bold" /> }
const SPOKEN: Record<DeltaDirection, string> = { up: 'up', down: 'down', flat: 'no change,' }

/** Change vs a previous period: arrow + value + comparison. Direction is spoken, not only shown by color. */
export function Delta({ value, direction = 'up', intent = 'neutral', comparison, className }: DeltaProps) {
  return (
    <span className={['ot-delta', `ot-delta--${intent}`, className].filter(Boolean).join(' ')}>
      <span className="ot-delta__arrow" aria-hidden="true">{ARROWS[direction]}</span>
      <span className="ot-stat__sr">{SPOKEN[direction]} </span>
      <span className="ot-delta__value">{value}</span>
      {comparison && <span className="ot-delta__comparison">{comparison}</span>}
    </span>
  )
}

export interface StatProps {
  /** What the number is (Figma `Label`), e.g. "Delivered impressions". */
  label: ReactNode
  /** The number (Figma `Value`), already formatted: "36.2". Rendered with tabular figures. */
  value: ReactNode
  /** Muted unit or context next to the value (Figma `Unit`): "%", "M", "M of 48.0M". */
  unit?: ReactNode
  /** Context line under the value (Figma `Secondary`): "through Nov 16", "4 preempted". */
  secondary?: ReactNode
  /** Optional change (Figma `Show delta`): `{ value: '+12%', direction: 'up', comparison: 'vs last week' }`. */
  delta?: Omit<DeltaProps, 'intent' | 'className'>
  /** Delta color by meaning: `success`, `danger` or `neutral` (default). */
  deltaIntent?: DeltaIntent
  /** Size (Figma `Size`): `sm` 20/28 · `md` 24/32 · `lg` hero 40/48. @default 'md' */
  size?: StatSize
  /** Definition shown in a Tooltip from the info icon next to the label (Figma `Show hint`). */
  hint?: ReactNode
  /** Replaces the default info icon of the hint. */
  icon?: ReactNode
  /** Makes the whole Stat a button (hover, pressed, focus, chevron). */
  onClick?: MouseEventHandler<HTMLElement>
  /** Makes the whole Stat a link (hover, pressed, focus, chevron). */
  href?: string
  /** Shows a skeleton with the same geometry and sets `aria-busy`. @default false */
  loading?: boolean
  /** Marks the value as unavailable: shows "—" and this reason in a Tooltip (Figma `State=Unavailable`). */
  unavailableReason?: ReactNode
  /** Extra class names. */
  className?: string
  /** @internal Forces a visual state for Storybook previews. */
  'data-preview-state'?: 'hover' | 'pressed' | 'focus'
}

// A text-line skeleton centered in the line box of the text it replaces, so heights match exactly.
function SkeletonLine({ lineHeight, width }: { lineHeight: string; width: number }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', height: `var(--ot-typography-${lineHeight}-line-height)` }}>
      <Skeleton size="sm" width={width} />
    </span>
  )
}

const toText = (n: ReactNode) => (typeof n === 'string' || typeof n === 'number' ? String(n) : '')

/**
 * A number with context — hero figure (`lg`) or KPI (`sm`, `md`). Value and unit are read as one phrase;
 * clickable stats get a surface outset by `--ot-stat-padding` so they stay aligned with neighbouring content.
 */
export function Stat({
  label,
  value,
  unit,
  secondary,
  delta,
  deltaIntent = 'neutral',
  size = 'md',
  hint,
  icon,
  onClick,
  href,
  loading = false,
  unavailableReason,
  className,
  'data-preview-state': previewState,
}: StatProps) {
  const hintId = useId()
  const unavailable = unavailableReason !== undefined
  const interactive = !loading && !unavailable && (onClick !== undefined || href !== undefined)
  const classes = ['ot-stat', `ot-stat--${size}`, interactive && 'ot-stat--interactive', unavailable && 'ot-stat--unavailable', className].filter(Boolean).join(' ')

  if (loading) {
    return (
      <div className={classes} aria-busy="true" aria-label={`${toText(label)}: loading`}>
        <div className="ot-stat__main">
          <SkeletonLine lineHeight={size === 'lg' ? 'label-md' : 'label-sm'} width={size === 'lg' ? 140 : 100} />
          <Skeleton shape="block" width={size === 'lg' ? 200 : 120} height={`var(--ot-typography-heading-${{ sm: 'md', md: 'lg', lg: '2xl' }[size]}-line-height)`} />
          <SkeletonLine lineHeight={size === 'lg' ? 'body-md' : 'body-sm'} width={size === 'lg' ? 120 : 80} />
        </div>
      </div>
    )
  }

  const hintIcon = icon ?? <Info />
  const header = (
    <span className="ot-stat__header">
      {label}
      {hint &&
        (interactive ? (
          // a tooltip button can't live inside a button/link: expose the hint as a description instead
          <span className="ot-stat__hint" aria-hidden="true">{hintIcon}</span>
        ) : (
          <Tooltip text={hint}>
            <button type="button" className="ot-stat__hint" aria-label={`About ${toText(label) || 'this metric'}`}>{hintIcon}</button>
          </Tooltip>
        ))}
    </span>
  )
  const valueRow = (
    <span className="ot-stat__value-row">
      {unavailable ? (
        <Tooltip text={unavailableReason}>
          <button type="button" className="ot-stat__unavailable" aria-label="Not available">
            <span className="ot-stat__value" aria-hidden="true">—</span>
          </button>
        </Tooltip>
      ) : (
        <>
          <span className="ot-stat__sr">{toText(value)} {toText(unit)}</span>
          <span className="ot-stat__value" aria-hidden="true">{value}</span>
          {unit && <span className="ot-stat__unit" aria-hidden="true">{unit}</span>}
        </>
      )}
    </span>
  )
  const body = (
    <>
      <span className="ot-stat__main">
        {header}
        {valueRow}
        {secondary && <span className="ot-stat__secondary">{secondary}</span>}
        {delta && <Delta {...delta} intent={deltaIntent} />}
        {interactive && hint && <span id={hintId} className="ot-stat__sr">{hint}</span>}
      </span>
      {interactive && <span className="ot-stat__chevron" aria-hidden="true"><CaretRight /></span>}
    </>
  )
  const describedBy = interactive && hint ? hintId : undefined

  if (interactive && href) return <a href={href} className={classes} onClick={onClick} aria-describedby={describedBy} data-preview-state={previewState}>{body}</a>
  if (interactive) return <button type="button" className={classes} onClick={onClick} aria-describedby={describedBy} data-preview-state={previewState}>{body}</button>
  return <div className={classes}>{body}</div>
}
