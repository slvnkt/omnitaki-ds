import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react'

import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style and role of the action (Figma `Type`).
   * - `primary` — the main action of a screen or section; use one per area.
   * - `secondary` — alternative or supporting actions next to a primary one.
   * - `ghost` — low-emphasis actions in toolbars, cards and dense UI.
   * - `danger` — destructive, hard-to-undo actions (delete, remove).
   * @default 'primary'
   */
  variant?: ButtonVariant
  /**
   * Height and density (Figma `Size`): `sm` 32px · `md` 40px · `lg` 48px.
   * Matches fields of the same size, so a Button and an Input stand in one line.
   * @default 'md'
   */
  size?: ButtonSize
  /**
   * Icon before the label (Figma `Leading icon` + `Show leading icon`).
   * Pass a Phosphor icon, e.g. `<Plus />`; size and color come from the button.
   * Decorative: hidden from screen readers, so the label must describe the action.
   */
  leadingIcon?: ReactNode
  /**
   * Icon after the label (Figma `Trailing icon` + `Show trailing icon`),
   * typically `<CaretDown />` for a button that opens a menu. Decorative, like `leadingIcon`.
   */
  trailingIcon?: ReactNode
  /**
   * Visible label (Figma `Label`). Use a short verb or verb + noun: "Save", "Add member".
   * It is also the accessible name of the button.
   */
  children?: ReactNode
  /**
   * Disables the button: no hover, press or click, and it is skipped by Tab
   * (native `disabled`). Prefer explaining why an action is unavailable next to the button.
   * @default false
   */
  disabled?: boolean
  /**
   * Native button type. Defaults to `button` so it never submits a form by accident;
   * set `submit` for the form's main action.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'
  /** Called on click, Enter or Space. Not called while `disabled`. */
  onClick?: MouseEventHandler<HTMLButtonElement>
  /** Extra class names merged after the component classes. Prefer props over overriding styles. */
  className?: string
}

/**
 * Triggers an action. Four types (Primary, Secondary, Ghost, Danger), three sizes (32/40/48)
 * and optional leading/trailing Phosphor icons. Renders a native `<button>`; styled only with
 * Omnitaki tokens (`--ot-button-*` sizes, Semantic colors), so it follows Light/Dark themes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leadingIcon, trailingIcon, children, className, type = 'button', ...rest },
  ref,
) {
  const classes = ['ot-button', `ot-button--${variant}`, `ot-button--${size}`, className].filter(Boolean).join(' ')

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {leadingIcon && (
        <span className="ot-button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span className="ot-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  )
})
