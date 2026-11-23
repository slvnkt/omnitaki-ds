import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import './Badge.css'

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Meaning of the badge (Figma `Type`):
   * `neutral` — default/inactive · `brand` — new, featured · `success` — done, active ·
   * `warning` — needs attention · `danger` — failed, blocked · `info` — informational.
   * @default 'neutral'
   */
  variant?: BadgeVariant
  /** Height (Figma `Size`): `sm` 16 · `md` 20 · `lg` 24. Text is Caption Strong at every size. @default 'md' */
  size?: BadgeSize
  /** Shows the leading status dot (Figma `Show dot`). Ignored when `icon` is set — use one of them. @default true */
  dot?: boolean
  /** Leading 12px icon (Figma `Show icon` + `Icon`), e.g. `<CheckCircle />` for a status. Replaces the dot. Decorative. */
  icon?: ReactNode
  /** Trailing 12px icon (Figma `Show trailing icon` + `Trailing icon`), e.g. `<X />` on a filter chip or `<CaretDown />`. Decorative — if it removes the badge, wrap the badge in a button with a label. */
  trailingIcon?: ReactNode
  /** Badge text (Figma `Label`). One or two words: "Active", "Overdue". */
  children: ReactNode
  /** Extra class names. */
  className?: string
}

/** Non-interactive status label: a short word with an optional dot or icon. Styled with `--ot-badge-*` and Semantic colors. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', size = 'md', dot = true, icon, trailingIcon, children, className, ...rest },
  ref,
) {
  const classes = ['ot-badge', `ot-badge--${variant}`, `ot-badge--${size}`, className].filter(Boolean).join(' ')
  return (
    <span ref={ref} className={classes} {...rest}>
      {icon ? (
        <span className="ot-badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : (
        dot && <span className="ot-badge__dot" aria-hidden="true" />
      )}
      {children}
      {trailingIcon && (
        <span className="ot-badge__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </span>
  )
})
