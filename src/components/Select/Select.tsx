import { CaretDown } from '@phosphor-icons/react'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

import { Field, type FieldSize } from '../Field'
import { ListItem } from '../ListItem'
import '../Input/Input.css'
import '../Menu/Menu.css'
import './Select.css'

export interface SelectOption {
  /** Value stored and submitted with the form. */
  value: string
  /** Text shown in the list and in the field when selected. */
  label: string
  /** Optional icon before the option label. */
  icon?: ReactNode
  /** Disabled option: shown but not selectable, skipped by keyboard. */
  disabled?: boolean
}

export interface SelectProps {
  /** Options of the list, in order. */
  options: SelectOption[]
  /** Visible label above the field (Figma `Label` + `Show label`). Also the accessible name. */
  label?: ReactNode
  /** Accessible name when there is no visible `label`. */
  'aria-label'?: string
  /** Hint, error or success text under the field (Figma `Helper` + `Show helper`); linked via `aria-describedby`. */
  helperText?: ReactNode
  /** Height and text size (Figma `Size`): `sm` 32 · `md` 40 · `lg` 48 — options use the same row size. @default 'md' */
  size?: FieldSize
  /** Selected value (controlled). Use with `onValueChange`. */
  value?: string
  /** Initially selected value (uncontrolled). */
  defaultValue?: string
  /** Called with the new value when the user picks an option. */
  onValueChange?: (value: string) => void
  /** Text shown while nothing is selected, e.g. "Select a currency". Not a replacement for `label`. */
  placeholder?: string
  /** Icon before the value (Figma `Leading icon` on the Field). Decorative. */
  leadingIcon?: ReactNode
  /** Error state: danger border, `aria-invalid`, helper shown as the error. @default false */
  invalid?: boolean
  /** Success state: success border and helper. Ignored when `invalid`. @default false */
  valid?: boolean
  /** Disables the select: not focusable, cannot open. @default false */
  disabled?: boolean
  /** Shows the value but cannot be changed; stays focusable. @default false */
  readOnly?: boolean
  /** Marks the field as required (`aria-required`). Show it in the label too. @default false */
  required?: boolean
  /** Form field name; the value is submitted through a hidden input. */
  name?: string
  /** Opens the list on first render (docs and visual tests). @default false */
  defaultOpen?: boolean
  /** Id of the combobox element; generated when omitted. */
  id?: string
  /** Class name on the root wrapper. */
  className?: string
  /** @internal Forces a visual state for Storybook previews. */
  'data-preview-state'?: 'hover' | 'focus'
}

/**
 * Single-choice dropdown field (WAI-ARIA select-only combobox). Label + shared `Field` box with CaretDown +
 * helper; opens a Menu-surface listbox of ListItems. Styled only with Omnitaki tokens.
 */
export function Select({
  options,
  label,
  'aria-label': ariaLabel,
  helperText,
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  leadingIcon,
  invalid = false,
  valid = false,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  defaultOpen = false,
  id,
  className,
  'data-preview-state': previewState,
}: SelectProps) {
  const uid = useId()
  const comboId = id ?? `ot-select-${uid}`
  const labelId = `${comboId}-label`
  const listId = `${comboId}-listbox`
  const helperId = helperText ? `${comboId}-helper` : undefined
  const optionId = (i: number) => `${comboId}-option-${i}`

  const [inner, setInner] = useState(defaultValue)
  const selected = value ?? inner
  const selectedIndex = options.findIndex(o => o.value === selected)
  const [open, setOpen] = useState(defaultOpen && !disabled && !readOnly)
  const [active, setActive] = useState(Math.max(selectedIndex, 0))
  const root = useRef<HTMLDivElement>(null)
  const combo = useRef<HTMLDivElement>(null)

  const enabledIdx = options.map((o, i) => (o.disabled ? -1 : i)).filter(i => i >= 0)
  const canOpen = !disabled && !readOnly

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const openList = (index = selectedIndex >= 0 ? selectedIndex : enabledIdx[0]) => {
    if (!canOpen) return
    setActive(index ?? 0)
    setOpen(true)
  }
  const choose = (index: number) => {
    const option = options[index]
    if (!option || option.disabled) return
    if (value === undefined) setInner(option.value)
    onValueChange?.(option.value)
    setOpen(false)
    combo.current?.focus()
  }
  const move = (delta: number) => {
    const pos = enabledIdx.indexOf(active)
    const next = enabledIdx[Math.min(Math.max(pos + delta, 0), enabledIdx.length - 1)]
    if (next !== undefined) setActive(next)
  }
  const typeahead = (char: string) => {
    const start = enabledIdx.indexOf(open ? active : Math.max(selectedIndex, 0))
    const order = [...enabledIdx.slice(start + 1), ...enabledIdx.slice(0, start + 1)]
    const match = order.find(i => options[i].label.toLowerCase().startsWith(char.toLowerCase()))
    if (match === undefined) return
    if (open) setActive(match)
    else choose(match)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!canOpen) return
    const { key } = event
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault()
        openList()
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault()
        openList(key === 'Home' ? enabledIdx[0] : enabledIdx[enabledIdx.length - 1])
      } else if (key.length === 1 && /\S/.test(key)) typeahead(key)
      return
    }
    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        move(-1)
        break
      case 'Home':
        event.preventDefault()
        setActive(enabledIdx[0])
        break
      case 'End':
        event.preventDefault()
        setActive(enabledIdx[enabledIdx.length - 1])
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        choose(active)
        break
      default:
        if (key.length === 1 && /\S/.test(key)) typeahead(key)
    }
  }

  const classes = [
    'ot-input',
    'ot-select',
    `ot-input--${size}`,
    invalid && 'ot-input--invalid',
    valid && !invalid && 'ot-input--valid',
    disabled && 'ot-input--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const current = options[selectedIndex]

  return (
    <div ref={root} className={classes}>
      {label && (
        <span id={labelId} className="ot-input__label" onClick={() => combo.current?.focus()}>
          {label}
        </span>
      )}
      <div className="ot-select__anchor">
        <Field
          ref={combo}
          id={comboId}
          size={size}
          leadingIcon={current?.icon ?? leadingIcon}
          trailingIcon={<CaretDown />}
          invalid={invalid}
          valid={valid}
          disabled={disabled}
          readOnly={readOnly}
          data-preview-state={previewState}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : ariaLabel}
          aria-controls={listId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-activedescendant={open ? optionId(active) : undefined}
          aria-describedby={helperId}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
        >
          <span className={['ot-select__value', !current && 'ot-select__value--placeholder'].filter(Boolean).join(' ')}>
            {current ? current.label : placeholder}
          </span>
        </Field>
        {open && (
          <div id={listId} role="listbox" aria-labelledby={label ? labelId : undefined} aria-label={label ? undefined : ariaLabel} className="ot-menu ot-select__listbox">
            {options.map((option, index) => (
              <ListItem
                key={option.value}
                id={optionId(index)}
                role="option"
                size={size}
                selected={index === selectedIndex}
                active={index === active}
                disabled={option.disabled}
                leadingIcon={option.icon}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => !option.disabled && setActive(index)}
                onClick={() => choose(index)}
              >
                {option.label}
              </ListItem>
            ))}
          </div>
        )}
      </div>
      {helperText && (
        <p id={helperId} className="ot-input__helper">
          {helperText}
        </p>
      )}
      {name && <input type="hidden" name={name} value={selected ?? ''} />}
    </div>
  )
}
