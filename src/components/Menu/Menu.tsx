import { forwardRef, useEffect, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'

import { ListItem, type ListItemSize } from '../ListItem'
import './Menu.css'

export interface MenuItem {
  /** Unique value, passed to `onSelect`. */
  value: string
  /** Row label. */
  label: ReactNode
  /** Icon before the label. */
  leadingIcon?: ReactNode
  /** Icon after the label (e.g. submenu caret). */
  trailingIcon?: ReactNode
  /** Disabled row: announced as unavailable and skipped by arrow keys. */
  disabled?: boolean
  /** Shows the check indicator (for single-choice menus such as "Sort by"). */
  selected?: boolean
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Rows of the menu, in order. Count is changed by data, not by variants. */
  items: MenuItem[]
  /** Row size (Figma `Size`) — use the size of the trigger button. @default 'md' */
  size?: ListItemSize
  /** Called with the item value on click, Enter or Space. */
  onSelect?: (value: string) => void
  /** Called on Escape or Tab, so the owner can close the menu and return focus to the trigger. */
  onClose?: () => void
  /** Moves focus to the first enabled row on mount (use when the menu opens from a trigger). @default false */
  autoFocus?: boolean
  /** Accessible name of the menu, e.g. "Invoice actions". Or point `aria-labelledby` at the trigger. */
  label?: string
}

/**
 * Floating list of actions (`role="menu"`). Owns roving focus and keyboard: ↑ ↓ Home End, Enter/Space, Escape.
 * Positioning and open state belong to the trigger (see the Dropdown story).
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { items, size = 'md', onSelect, onClose, autoFocus = false, label, className, onKeyDown, ...rest },
  ref,
) {
  const rows = useRef<(HTMLDivElement | null)[]>([])
  const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled)

  // Focus the first enabled row once, when the menu opens.
  useEffect(() => {
    if (autoFocus) rows.current.find(row => row && row.getAttribute('aria-disabled') !== 'true')?.focus()
  }, [autoFocus])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    const current = enabled.findIndex(({ index }) => rows.current[index] === document.activeElement)
    const focusAt = (i: number) => rows.current[enabled[(i + enabled.length) % enabled.length].index]?.focus()
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusAt(current + 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusAt(current < 0 ? -1 : current - 1)
        break
      case 'Home':
        event.preventDefault()
        focusAt(0)
        break
      case 'End':
        event.preventDefault()
        focusAt(-1)
        break
      case 'Enter':
      case ' ':
        if (current >= 0) {
          event.preventDefault()
          onSelect?.(enabled[current].item.value)
        }
        break
      case 'Escape':
        event.preventDefault()
        onClose?.()
        break
      case 'Tab':
        onClose?.()
        break
    }
  }

  return (
    <div ref={ref} role="menu" aria-label={label} className={['ot-menu', className].filter(Boolean).join(' ')} onKeyDown={handleKeyDown} {...rest}>
      {items.map((item, index) => (
        <ListItem
          key={item.value}
          ref={el => {
            rows.current[index] = el
          }}
          role={item.selected !== undefined ? 'menuitemradio' : 'menuitem'}
          size={size}
          tabIndex={-1}
          selected={item.selected}
          disabled={item.disabled}
          leadingIcon={item.leadingIcon}
          trailingIcon={item.trailingIcon}
          onClick={() => !item.disabled && onSelect?.(item.value)}
        >
          {item.label}
        </ListItem>
      ))}
    </div>
  )
})
