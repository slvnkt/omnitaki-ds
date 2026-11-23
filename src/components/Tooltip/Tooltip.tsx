import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'

import './Tooltip.css'

export type TooltipVariant = 'dark' | 'light'
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipRow {
  /** Series or metric name. */
  label: ReactNode
  /** Value, rendered with tabular figures. */
  value: ReactNode
  /** Series marker color — any CSS color, usually `var(--ot-color-chart-1)`. */
  color?: string
}

export interface TooltipContentProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title'> {
  /** Surface (Figma `Variant`): `dark` for short hints, `light` for charts and multi-line values. @default 'dark' */
  variant?: TooltipVariant
  /** Optional bold first line (Figma `Title` + `Show title`). */
  title?: ReactNode
  /** Main text (Figma `Text`). Keep it to one or two short sentences. */
  text?: ReactNode
  /** "label · value" rows for charts (Figma `Show rows`). */
  rows?: TooltipRow[]
  /** Ref to the surface element. */
  ref?: Ref<HTMLSpanElement>
}

/**
 * The tooltip surface without positioning. Use it directly as Recharts / shadcn `ChartTooltipContent`
 * (`<Tooltip content={<TooltipContent variant="light" … />} />`) so charts share the DS look.
 */
export function TooltipContent({ variant = 'dark', title, text, rows, className, children, ref, ...rest }: TooltipContentProps) {
  return (
    <span ref={ref} className={['ot-tooltip', variant === 'light' && 'ot-tooltip--light', className].filter(Boolean).join(' ')} {...rest}>
      {title && <span className="ot-tooltip__title">{title}</span>}
      {text && <span className="ot-tooltip__text">{text}</span>}
      {rows && rows.length > 0 && (
        <dl className="ot-tooltip__rows">
          {rows.map((row, i) => (
            <div key={i} className="ot-tooltip__row">
              <dt className="ot-tooltip__series">
                {row.color && <span className="ot-tooltip__marker" style={{ background: row.color }} aria-hidden="true" />}
                {row.label}
              </dt>
              <dd className="ot-tooltip__value">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {children}
    </span>
  )
}

export interface TooltipProps extends Omit<TooltipContentProps, 'children'> {
  /** The trigger: one focusable element (button, link, Term). It gets `aria-describedby`. */
  children: ReactElement<Record<string, unknown>>
  /** Preferred side (Figma `Placement`); flips to the opposite side if there is no room. @default 'top' */
  placement?: TooltipPlacement
  /** Open delay in ms. Moving between triggers within this time opens instantly. @default 300 */
  delay?: number
  /** Controlled open state (for docs and visual tests). */
  open?: boolean
  /** Class name on the wrapper around the trigger (e.g. to position it absolutely). */
  anchorClassName?: string
  /** Inline style on the wrapper around the trigger. */
  anchorStyle?: CSSProperties
}

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
let lastClosedAt = 0

/**
 * Short contextual hint on hover and keyboard focus. Escape closes it; the pointer can move onto it
 * without closing (WCAG 1.4.13). Never put required information only in a tooltip.
 */
export function Tooltip({ children, placement = 'top', delay = 300, open: controlled, variant = 'dark', title, text, rows, className, anchorClassName, anchorStyle, ...rest }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const tip = useRef<HTMLSpanElement>(null)
  const isOpen = controlled ?? open
  const side = flipped ? OPPOSITE[placement] : placement

  const show = () => {
    window.clearTimeout(timer.current)
    setFlipped(false)
    const warm = Date.now() - lastClosedAt < delay
    if (warm) setOpen(true)
    else timer.current = window.setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    window.clearTimeout(timer.current)
    if (open) lastClosedAt = Date.now()
    setOpen(false)
  }

  useEffect(() => {
    if (!isOpen || controlled !== undefined) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // auto-flip once per opening when the preferred side is out of the viewport (DOM measurement)
  useLayoutEffect(() => {
    const r = isOpen ? tip.current?.getBoundingClientRect() : undefined
    if (!r) return
    const out = { top: r.top < 0, bottom: r.bottom > window.innerHeight, left: r.left < 0, right: r.right > window.innerWidth }
    if (out[placement]) setFlipped(true)
  }, [isOpen, placement])

  const trigger = isValidElement(children)
    ? cloneElement(children, { 'aria-describedby': isOpen ? id : undefined })
    : children

  return (
    <span className={['ot-tooltip-anchor', anchorClassName].filter(Boolean).join(' ')} style={anchorStyle} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {trigger}
      {isOpen && (
        <TooltipContent
          ref={tip}
          id={id}
          role="tooltip"
          variant={variant}
          title={title}
          text={text}
          rows={rows}
          className={['ot-tooltip--floating', `ot-tooltip--${side}`, className].filter(Boolean).join(' ')}
          {...rest}
        >
          <span className="ot-tooltip__arrow" aria-hidden="true" />
        </TooltipContent>
      )}
    </span>
  )
}

export interface TermProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'title'> {
  /** The term itself (Figma `Label`), shown with a dotted underline. */
  children: ReactNode
  /** Definition shown in the tooltip. */
  definition: ReactNode
  /** Optional tooltip title (defaults to none — the term is already visible). */
  title?: ReactNode
  /** Tooltip side. @default 'top' */
  placement?: TooltipPlacement
  /** @internal Forces a visual state for Storybook previews. */
  'data-preview-state'?: 'hover' | 'focus'
}

/** Inline term with a dotted underline that opens its definition on hover or focus. Keyboard-focusable. */
export function Term({ children, definition, title, placement = 'top', className, ...rest }: TermProps) {
  return (
    <Tooltip text={definition} title={title} placement={placement}>
      <button type="button" className={['ot-term', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </button>
    </Tooltip>
  )
}
