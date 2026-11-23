import type { HTMLAttributes, ReactNode } from 'react'
import { ChartLine, Clock, Prohibit, WarningCircle } from '@phosphor-icons/react'

import './EmptyState.css'

export type EmptyStateVariant = 'no-data' | 'error' | 'no-access' | 'not-started'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Why there is nothing to show (Figma `Variant`). Sets the default icon; `error` also tints the icon circle and announces itself. @default 'no-data' */
  variant?: EmptyStateVariant
  /** `compact` inside a Card or table, `default` for a page or a whole panel (Figma `Size`). @default 'default' */
  size?: 'compact' | 'default'
  /** Replaces the variant's default Phosphor icon (ChartLine, WarningCircle, Prohibit, Clock). Decorative. */
  icon?: ReactNode
  /** What happened, in a few words: "No data for this period". */
  title: ReactNode
  /** What it means or what to do next. Up to three lines, longer text is clamped. */
  description?: ReactNode
  /** One or two Buttons (`size="sm"` in compact, `"md"` in default). Primary action last. */
  actions?: ReactNode
  /** Heading level of the title so it fits the page outline. @default 'h3' */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p'
}

const ICONS: Record<EmptyStateVariant, ReactNode> = {
  'no-data': <ChartLine />,
  error: <WarningCircle />,
  'no-access': <Prohibit />,
  'not-started': <Clock />,
}

/** Placeholder for a widget, table or page that has nothing to show: no data yet, a failed load, no access, not started. */
export function EmptyState({
  variant = 'no-data',
  size = 'default',
  icon,
  title,
  description,
  actions,
  titleAs: Title = 'h3',
  className,
  ...rest
}: EmptyStateProps) {
  const classes = ['ot-empty-state', `ot-empty-state--${size}`, `ot-empty-state--${variant}`, className].filter(Boolean).join(' ')
  return (
    <div className={classes} role={variant === 'error' ? 'alert' : undefined} {...rest}>
      <span className="ot-empty-state__icon" aria-hidden="true">{icon ?? ICONS[variant]}</span>
      <div className="ot-empty-state__text">
        <Title className="ot-empty-state__title">{title}</Title>
        {description && <p className="ot-empty-state__description">{description}</p>}
      </div>
      {actions && <div className="ot-empty-state__actions">{actions}</div>}
    </div>
  )
}
