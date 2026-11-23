import { createContext, useContext, useId, type ElementType, type HTMLAttributes, type ReactNode } from 'react'

import { Divider } from '../Divider'
import { Skeleton } from '../Skeleton'
import './Card.css'

const CardContext = createContext<string | undefined>(undefined)

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * Surface (Figma `Variant`): `default` — bg/primary, border, Elevation/sm; `outlined` — no shadow
   * (dense grids); `muted` — bg/secondary with a muted title, for inactive entities (paused, archived).
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'muted'
  /** Inner padding and gap (Figma `Padding`): `md` 16 · `lg` 24. @default 'md' */
  padding?: 'md' | 'lg'
  /** Element to render: `section` (default, labelled by its title), `article`, `div`, `li`… */
  as?: ElementType
  /** Card content: `CardHeader`, `CardBody`, `CardDivider`, `CardFooter`. */
  children?: ReactNode
}

/** Container for dashboard widgets. Labelled by its `CardHeader` title via `aria-labelledby`. */
export function Card({ variant = 'default', padding = 'md', as: Comp = 'section', className, children, ...rest }: CardProps) {
  const titleId = useId()
  const classes = ['ot-card', `ot-card--${variant}`, padding === 'lg' && 'ot-card--lg', className].filter(Boolean).join(' ')
  return (
    <CardContext.Provider value={titleId}>
      <Comp className={classes} aria-labelledby={rest['aria-label'] ? undefined : titleId} {...rest}>
        {children}
      </Comp>
    </CardContext.Provider>
  )
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card title (Figma `Title`), Subtitle 2. Also the card's accessible name. */
  title: ReactNode
  /** Optional line under the title (Figma `Subtitle` + `Show subtitle`), Caption. */
  subtitle?: ReactNode
  /** Right slot (Figma `Header action`): Badge, IconButton or a Menu trigger. */
  action?: ReactNode
  /** Heading level of the title. @default 'h3' */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p'
}

/** Header row: title, subtitle and a right slot. */
export function CardHeader({ title, subtitle, action, titleAs: Title = 'h3', className, ...rest }: CardHeaderProps) {
  const titleId = useContext(CardContext)
  return (
    <div className={['ot-card__header', className].filter(Boolean).join(' ')} {...rest}>
      <div className="ot-card__heading">
        <Title id={titleId} className="ot-card__title">{title}</Title>
        {subtitle && <p className="ot-card__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="ot-card__action">{action}</div>}
    </div>
  )
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Replaces the content with a skeleton (Figma `State=Loading`) and sets `aria-busy`. Pass `skeleton` to match your content. @default false */
  loading?: boolean
  /** Custom skeleton matching the real content's geometry. Defaults to a label + figure + bar placeholder. */
  skeleton?: ReactNode
}

/** Body slot. For errors, put an `Alert` (partial failure) or an `EmptyState` variant="error" (whole widget) inside. */
export function CardBody({ loading = false, skeleton, className, children, ...rest }: CardBodyProps) {
  return (
    <div className={['ot-card__body', className].filter(Boolean).join(' ')} aria-busy={loading || undefined} {...rest}>
      {loading
        ? skeleton ?? (
            <div className="ot-card__skeleton">
              <Skeleton size="sm" width="30%" />
              <Skeleton shape="block" height="var(--ot-control-height-lg)" />
              <Skeleton size="sm" width="40%" />
              <Skeleton shape="block" height="var(--ot-progress-size-md-height)" />
            </div>
          )
        : children}
    </div>
  )
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Meta text on the left (Figma `Meta`), e.g. "Updated 5 min ago". */
  meta?: ReactNode
  /** Actions on the right, usually ghost Buttons. */
  children?: ReactNode
}

/** Footer row: meta text on the left, actions on the right. */
export function CardFooter({ meta, className, children, ...rest }: CardFooterProps) {
  return (
    <div className={['ot-card__footer', className].filter(Boolean).join(' ')} {...rest}>
      {meta && <p className="ot-card__meta">{meta}</p>}
      {children && <div className="ot-card__actions">{children}</div>}
    </div>
  )
}

/** Optional line between body and footer (Figma `Show divider`). Spacing comes from the card gap. */
export function CardDivider() {
  return <Divider />
}
