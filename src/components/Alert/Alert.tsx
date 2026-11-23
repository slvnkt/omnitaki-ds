import { CheckCircle, Info, Warning, WarningCircle, X } from '@phosphor-icons/react'
import type { HTMLAttributes, ReactNode } from 'react'

import { IconButton } from '../IconButton'
import './Alert.css'

export type AlertIntent = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Meaning (Figma `Intent`): `info` — neutral news (data recalculated), `success` — done,
   * `warning` — degraded but usable (data delayed), `danger` — failed (couldn't load), `neutral` — notes.
   * @default 'info'
   */
  intent?: AlertIntent
  /** Placement (Figma `Variant`): `inline` inside a card (radius, full border) or `banner` across a container. @default 'inline' */
  variant?: 'inline' | 'banner'
  /** Optional title (Figma `Title` + `Show title`). Short: "Data is delayed". */
  title?: ReactNode
  /** Message text (Figma `Text`), up to two lines: what happened and what it means. */
  children?: ReactNode
  /** Action slot (Figma `Show action`): usually `<Button variant="ghost" size="sm">Why?</Button>` or "Retry". */
  action?: ReactNode
  /** Shows the dismiss button (Figma `Show dismiss`) and is called when it's pressed. */
  onDismiss?: () => void
  /** Accessible name of the dismiss button. @default 'Dismiss' */
  dismissLabel?: string
  /** Replaces the intent icon. Use Phosphor icons; status must still be clear from the text. */
  icon?: ReactNode
}

const ICONS: Record<AlertIntent, ReactNode> = {
  info: <Info />,
  success: <CheckCircle />,
  warning: <Warning />,
  danger: <WarningCircle />,
  neutral: <Info />,
}

/**
 * Message inside a card or across a container: recalculated figures, delayed data, errors.
 * `role="alert"` for danger (announced immediately), `role="status"` otherwise.
 */
export function Alert({
  intent = 'info',
  variant = 'inline',
  title,
  children,
  action,
  onDismiss,
  dismissLabel = 'Dismiss',
  icon,
  className,
  ...rest
}: AlertProps) {
  const classes = ['ot-alert', `ot-alert--${intent}`, `ot-alert--${variant}`, !title && 'ot-alert--untitled', className].filter(Boolean).join(' ')
  return (
    <div role={intent === 'danger' ? 'alert' : 'status'} className={classes} {...rest}>
      <span className="ot-alert__icon" aria-hidden="true">
        {icon ?? ICONS[intent]}
      </span>
      <div className="ot-alert__content">
        {title && <p className="ot-alert__title">{title}</p>}
        {children && <div className="ot-alert__text">{children}</div>}
      </div>
      {(action || onDismiss) && (
        <div className="ot-alert__actions">
          {action}
          {onDismiss && <IconButton variant="ghost" size="sm" icon={<X />} label={dismissLabel} onClick={onDismiss} />}
        </div>
      )}
    </div>
  )
}
