import type { HTMLAttributes } from 'react'

import './Divider.css'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Direction (Figma `Orientation`): horizontal fills the width, vertical fills the height of a flex row. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Space on both sides (Figma `Spacing`): `none` · `sm` 8 · `md` 12 · `lg` 16. @default 'none' */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Purely visual (default): hidden from assistive tech. Set `false` when the line separates
   * groups of content — it becomes `role="separator"` with `aria-orientation`.
   * @default true
   */
  decorative?: boolean
}

/** 1px separator line (border/primary). Decorative by default. */
export function Divider({ orientation = 'horizontal', spacing = 'none', decorative = true, className, ...rest }: DividerProps) {
  const classes = ['ot-divider', `ot-divider--${orientation}`, spacing !== 'none' && `ot-divider--${spacing}`, className].filter(Boolean).join(' ')
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'separator', 'aria-orientation': orientation }
  return <div className={classes} {...a11y} {...rest} />
}
