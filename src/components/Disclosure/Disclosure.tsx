import { useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react'

import './Disclosure.css'

export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Trigger text (Figma `Label`). Say what is inside: "How delivery is calculated". */
  label: ReactNode
  /** Panel content (Figma `Content`). Text gets Body 1 in `text/secondary`; any nodes are allowed. */
  children: ReactNode
  /** Initial state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Controlled open state (Figma `Expanded`). Use with `onOpenChange`. */
  open?: boolean
  /** Called with the next open state on click, Enter or Space. */
  onOpenChange?: (open: boolean) => void
  /** Disables the trigger; the panel keeps its current state. @default false */
  disabled?: boolean
  /** Wraps the trigger in a heading of this level so the section shows up in the page outline. Omit when the disclosure is not a section. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Forces a visual trigger state for docs (`hover`, `pressed`, `focus`). */
  'data-preview-state'?: 'hover' | 'pressed' | 'focus'
}

/**
 * Show / hide a section of secondary content (WAI-ARIA disclosure pattern): a full-width ghost trigger with a chevron
 * and a panel whose height animates (off under `prefers-reduced-motion`). Stack several with Dividers for an accordion.
 */
export function Disclosure({
  label,
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  disabled = false,
  headingLevel,
  className,
  'data-preview-state': previewState,
  ...rest
}: DisclosureProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const open = openProp ?? innerOpen
  const id = useId()
  const panelId = `${id}-panel`
  const triggerId = `${id}-trigger`

  const toggle = () => {
    if (openProp === undefined) setInnerOpen(!open)
    onOpenChange?.(!open)
  }

  const trigger = (
    <button
      type="button"
      id={triggerId}
      className="ot-disclosure__trigger"
      aria-expanded={open}
      aria-controls={panelId}
      disabled={disabled}
      onClick={toggle}
      data-preview-state={previewState}
    >
      <span className="ot-disclosure__label">{label}</span>
      <span className="ot-disclosure__chevron" aria-hidden="true"><CaretDown /></span>
    </button>
  )
  const Heading = headingLevel ? (`h${headingLevel}` as const) : null

  return (
    <div className={['ot-disclosure', open && 'ot-disclosure--open', className].filter(Boolean).join(' ')} {...rest}>
      {Heading ? <Heading className="ot-disclosure__heading">{trigger}</Heading> : trigger}
      <div id={panelId} className="ot-disclosure__panel">
        <div className="ot-disclosure__panel-inner">
          <div className="ot-disclosure__content">{children}</div>
        </div>
      </div>
    </div>
  )
}
