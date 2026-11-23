import { useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'

import { Tab, type TabsVariant } from './Tab'
import './Tabs.css'

export interface TabItem {
  /** Unique value of the tab, returned by `onValueChange`. */
  value: string
  /** Visible label. */
  label: ReactNode
  /** Optional 16px Phosphor icon before the label. */
  icon?: ReactNode
  /** Disables this tab: skipped by arrow keys and not selectable. */
  disabled?: boolean
  /** Panel content shown when the tab is selected. Omit to render only the tab list (e.g. for routing). */
  content?: ReactNode
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Tabs to render, in order. */
  items: TabItem[]
  /**
   * Visual style (Figma `Type`):
   * `underline` — page or section navigation on a divider line;
   * `filled` — segmented control for switching views of the same content.
   * @default 'underline'
   */
  variant?: TabsVariant
  /** Selected value (controlled). Use with `onValueChange`. */
  value?: string
  /** Initially selected value (uncontrolled). Defaults to the first enabled tab. */
  defaultValue?: string
  /** Called with the new value when the user selects a tab (click, arrows, Home/End). */
  onValueChange?: (value: string) => void
  /** Accessible name of the tab list (`aria-label`), e.g. "Invoice sections". Required unless `aria-labelledby` is set. */
  label?: string
  /** Extra class names on the root. */
  className?: string
}

/**
 * Switches between related views without leaving the page. WAI-ARIA tabs pattern:
 * roving focus, arrow keys / Home / End, automatic activation. Styled with `--ot-tabs-*` and Semantic colors.
 */
export function Tabs({
  items,
  variant = 'underline',
  value,
  defaultValue,
  onValueChange,
  label,
  className,
  ...rest
}: TabsProps) {
  const id = useId()
  const firstEnabled = items.find(i => !i.disabled)?.value
  const [inner, setInner] = useState(defaultValue ?? firstEnabled)
  const selected = value ?? inner
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const hasPanels = items.some(i => i.content !== undefined)

  const select = (next: string) => {
    if (value === undefined) setInner(next)
    onValueChange?.(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled)
    const current = enabled.findIndex(({ item }) => item.value === selected)
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') nextIndex = (current + 1) % enabled.length
    if (event.key === 'ArrowLeft') nextIndex = (current - 1 + enabled.length) % enabled.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = enabled.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    const target = enabled[nextIndex]
    select(target.item.value)
    refs.current[target.index]?.focus()
  }

  return (
    <div className={['ot-tabs', `ot-tabs--${variant}`, className].filter(Boolean).join(' ')} {...rest}>
      <div className="ot-tabs__list" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {items.map((item, index) => {
          const isSelected = item.value === selected
          return (
            <Tab
              key={item.value}
              ref={el => {
                refs.current[index] = el
              }}
              id={`${id}-tab-${index}`}
              variant={variant}
              selected={isSelected}
              icon={item.icon}
              disabled={item.disabled}
              tabIndex={isSelected ? 0 : -1}
              aria-controls={hasPanels ? `${id}-panel-${index}` : undefined}
              onClick={() => select(item.value)}
            >
              {item.label}
            </Tab>
          )
        })}
      </div>
      {hasPanels &&
        items.map((item, index) => (
          <div
            key={item.value}
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${index}`}
            className="ot-tabs__panel"
            tabIndex={0}
            hidden={item.value !== selected}
          >
            {item.content}
          </div>
        ))}
    </div>
  )
}
