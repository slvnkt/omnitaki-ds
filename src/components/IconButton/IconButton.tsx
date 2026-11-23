import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react'

import type { ButtonSize, ButtonVariant } from '../Button'
import '../Button/Button.css'
import './IconButton.css'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * The icon (Figma `Icon`), e.g. `<Plus />` from `@phosphor-icons/react`.
   * Sized by the button (`--ot-button-size-*-icon-size`) and colored with the label color of the type.
   */
  icon: ReactNode
  /**
   * Accessible name, required — the button has no visible text.
   * Describe the action, not the icon: "Add member", not "Plus". Rendered as `aria-label`.
   */
  label: string
  /** Visual style (Figma `Type`), same as Button. Use `ghost` in toolbars and dense rows. @default 'primary' */
  variant?: ButtonVariant
  /** Square size (Figma `Size`): `sm` 32 · `md` 40 · `lg` 48 — equals Button height. @default 'md' */
  size?: ButtonSize
  /** Disables the button: skipped by Tab, ignores clicks. @default false */
  disabled?: boolean
  /** Native button type; defaults to `button` so it never submits a form by accident. @default 'button' */
  type?: 'button' | 'submit' | 'reset'
  /** Called on click, Enter or Space. */
  onClick?: MouseEventHandler<HTMLButtonElement>
  /** Extra class names on the `<button>`. */
  className?: string
}

/**
 * Square icon-only button for toolbars, table rows and compact headers.
 * Shares every Button token and state; needs `label` for screen readers.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'primary', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  const classes = ['ot-button', 'ot-icon-button', `ot-button--${variant}`, `ot-button--${size}`, className].filter(Boolean).join(' ')
  return (
    <button ref={ref} type={type} className={classes} aria-label={label} {...rest}>
      <span className="ot-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  )
})
