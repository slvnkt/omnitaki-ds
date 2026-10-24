import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma `Type`. */
  variant?: ButtonVariant
  /** Figma `Size`: sm 32 · md 40 · lg 48. */
  size?: ButtonSize
  /** Figma `Leading icon` slot. Phosphor icon, e.g. `<Plus />` (sized and colored by the button). */
  leadingIcon?: ReactNode
  /** Figma `Trailing icon` slot. Phosphor icon, e.g. `<CaretDown />`. */
  trailingIcon?: ReactNode
  /** Figma `Label`. */
  children?: ReactNode
}

/** Action button. Figma: Omnitaki DS › Button. Tokens: `--ot-button-*` + Semantic colors. */
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
