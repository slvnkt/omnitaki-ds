import { Check } from '@phosphor-icons/react'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import './ListItem.css'

export type ListItemSize = 'sm' | 'md' | 'lg'

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Row height and label size (Figma `Size`): `sm` 32 · `md` 40 · `lg` 48 — same as the trigger it belongs to. @default 'md' */
  size?: ListItemSize
  /** Selected option (Figma `Selected`): shows the check indicator, no fill. Sets `aria-selected` for `role="option"`. @default false */
  selected?: boolean
  /** Icon before the label (Figma `Leading icon`). Decorative. */
  leadingIcon?: ReactNode
  /** Icon after the label (Figma `Trailing icon`), e.g. a caret for a submenu or a shortcut hint. Decorative. */
  trailingIcon?: ReactNode
  /** Disabled row (Figma `State=Disabled`): `aria-disabled`, skipped by keyboard navigation. @default false */
  disabled?: boolean
  /** Keyboard-active row in a listbox using `aria-activedescendant` (rendered as hover + focus ring). */
  active?: boolean
  /**
   * ARIA role of the row: `menuitem` inside Menu, `option` inside a listbox (Select), `menuitemcheckbox` / `menuitemradio` for toggles.
   * @default 'menuitem'
   */
  role?: 'menuitem' | 'option' | 'menuitemcheckbox' | 'menuitemradio'
  /** Row label (Figma `Label`). */
  children: ReactNode
  /** @internal Forces a visual state for Storybook previews. */
  'data-preview-state'?: 'hover' | 'focus'
}

/**
 * Base row for Menu and Select options (Figma `ListItem`). Not used on its own:
 * the container (Menu, Select listbox) manages focus and keyboard.
 */
export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(function ListItem(
  { size = 'md', selected = false, leadingIcon, trailingIcon, disabled = false, active = false, role = 'menuitem', children, className, ...rest },
  ref,
) {
  const classes = ['ot-list-item', `ot-list-item--${size}`, className].filter(Boolean).join(' ')
  const selectedAttr =
    role === 'option' ? { 'aria-selected': selected } : role === 'menuitem' ? {} : { 'aria-checked': selected }
  return (
    <div
      ref={ref}
      role={role}
      className={classes}
      aria-disabled={disabled || undefined}
      data-active={active || undefined}
      {...selectedAttr}
      {...rest}
    >
      {leadingIcon && (
        <span className="ot-list-item__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="ot-list-item__label">{children}</span>
      {trailingIcon && (
        <span className="ot-list-item__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
      {selected && (
        <span className="ot-list-item__indicator" aria-hidden="true">
          <Check weight="bold" />
        </span>
      )}
    </div>
  )
})
