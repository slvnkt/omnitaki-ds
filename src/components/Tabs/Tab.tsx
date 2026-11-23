import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import './Tabs.css'

export type TabsVariant = 'underline' | 'filled'

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style (Figma `Type`), inherited from the parent Tabs. @default 'underline' */
  variant?: TabsVariant
  /** Selected tab (Figma `Selected`). Sets `aria-selected`. @default false */
  selected?: boolean
  /** Optional 16px icon before the label (Figma `Show icon` + `Icon`). Decorative. */
  icon?: ReactNode
  /** Tab label (Figma `Label`). Short noun: "Overview", "Invoices". */
  children: ReactNode
}

/** One tab (`role="tab"`). Used by `Tabs`; render it directly only for custom tab lists. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { variant = 'underline', selected = false, icon, children, className, type = 'button', ...rest },
  ref,
) {
  const classes = ['ot-tab', `ot-tab--${variant}`, className].filter(Boolean).join(' ')
  return (
    <button ref={ref} type={type} role="tab" aria-selected={selected} className={classes} {...rest}>
      {icon && (
        <span className="ot-tab__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
})
