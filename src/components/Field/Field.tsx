import type { HTMLAttributes, MouseEvent, ReactNode } from 'react'

import './Field.css'

export type FieldSize = 'sm' | 'md' | 'lg'

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Height and text size: `sm` 32px · `md` 40px · `lg` 48px. @default 'md' */
  size?: FieldSize
  /** Icon before the value (Figma `Leading icon`). Decorative, hidden from screen readers. */
  leadingIcon?: ReactNode
  /** Icon after the value (Figma `Trailing icon`). Takes the status color in error/success. */
  trailingIcon?: ReactNode
  /** Error state: danger border and trailing icon. */
  invalid?: boolean
  /** Success state: success border and trailing icon. */
  valid?: boolean
  /** Disabled look; the nested control must be disabled too. */
  disabled?: boolean
  /** Read-only look: tertiary surface, no hover/focus change. */
  readOnly?: boolean
  /** The native control, rendered with `className="ot-field__control"`. */
  children: ReactNode
}

/**
 * Internal primitive: the bordered box shared by Input, Select, Date picker, Combobox.
 * Owns height, border/background per state and icon slots; the composite passes the control.
 * Not exported publicly — use `Input` (or future composites) in product code.
 */
export function Field({
  size = 'md',
  leadingIcon,
  trailingIcon,
  invalid,
  valid,
  disabled,
  readOnly,
  className,
  children,
  onMouseDown,
  ...rest
}: FieldProps) {
  const classes = [
    'ot-field',
    `ot-field--${size}`,
    invalid && 'ot-field--invalid',
    valid && !invalid && 'ot-field--valid',
    readOnly && 'ot-field--readonly',
    disabled && 'ot-field--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Clicking padding or an icon focuses the control, like clicking the text area itself.
  const focusControl = (event: MouseEvent<HTMLDivElement>) => {
    onMouseDown?.(event)
    const control = event.currentTarget.querySelector<HTMLElement>('.ot-field__control')
    if (control && event.target !== control && !disabled) {
      event.preventDefault()
      control.focus()
    }
  }

  return (
    <div className={classes} onMouseDown={focusControl} {...rest}>
      {leadingIcon && (
        <span className="ot-field__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span className="ot-field__icon ot-field__icon--trailing" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </div>
  )
}
