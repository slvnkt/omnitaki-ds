import { forwardRef, useId, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode } from 'react'

import { Field, type FieldSize } from '../Field'
import './Input.css'

export type InputSize = FieldSize

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Visible label above the field (Figma `Label` + `Show label`). Also the accessible name.
   * Omit only when the purpose is obvious from context (e.g. a search bar) and pass `aria-label` instead.
   */
  label?: ReactNode
  /**
   * Text under the field (Figma `Helper` + `Show helper`): a hint, the error message when `invalid`,
   * or a confirmation when `valid`. Linked to the input via `aria-describedby`.
   */
  helperText?: ReactNode
  /**
   * Height and text size (Figma `Size`): `sm` 32px · `md` 40px · `lg` 48px — same as Button of that size.
   * @default 'md'
   */
  size?: InputSize
  /** Icon before the value, e.g. `<MagnifyingGlass />` for search (Figma `Leading icon`). Decorative. */
  leadingIcon?: ReactNode
  /**
   * Icon after the value (Figma `Trailing icon`). Decorative; takes the danger/success color
   * with `invalid`/`valid`. For an interactive action (clear, show password) use a real button.
   */
  trailingIcon?: ReactNode
  /** Error state (Figma `State=Error`): danger border, helper shown as the error and `aria-invalid="true"`. */
  invalid?: boolean
  /** Success state (Figma `State=Success`): success border and helper. Ignored when `invalid`. */
  valid?: boolean
  /** Disables the input: not focusable, not submitted with the form. @default false */
  disabled?: boolean
  /** Shows the value without allowing edits; still focusable, selectable and submitted (Figma `Readonly`). @default false */
  readOnly?: boolean
  /** Marks the field as required for forms and assistive tech. Add "(required)" or "*" to the label yourself. @default false */
  required?: boolean
  /** Hint shown while empty. Never a replacement for `label` — it disappears on typing. */
  placeholder?: string
  /** Native input type: `text`, `email`, `password`, `search`, `tel`, `url`, `number`… @default 'text' */
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  /** Controlled value. Use with `onChange`; or use `defaultValue` for an uncontrolled input. */
  value?: string | number | readonly string[]
  /** Called on every edit with the native change event (`event.target.value`). */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /** Id of the `<input>`; generated when omitted. The label and helper are wired to it. */
  id?: string
  /** Class name on the root wrapper (label + field + helper). Other props go to the `<input>`. */
  className?: string
  /** @internal Forces a visual state for Storybook previews. */
  'data-preview-state'?: 'hover' | 'focus'
}

/**
 * Text input with label and helper text. Composite of a label, the shared `Field` box
 * (sizes, states, icon slots) and a helper/error message. Renders a native `<input>`;
 * styled only with Omnitaki tokens (`--ot-field-*`, Semantic colors), so it follows Light/Dark themes.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    size = 'md',
    leadingIcon,
    trailingIcon,
    invalid = false,
    valid = false,
    disabled = false,
    readOnly = false,
    id,
    className,
    type = 'text',
    'data-preview-state': previewState,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `ot-input-${autoId}`
  const helperId = helperText ? `${inputId}-helper` : undefined
  const describedBy = [helperId, ariaDescribedBy].filter(Boolean).join(' ') || undefined

  const classes = [
    'ot-input',
    `ot-input--${size}`,
    invalid && 'ot-input--invalid',
    valid && !invalid && 'ot-input--valid',
    disabled && 'ot-input--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {label && (
        <label className="ot-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <Field
        size={size}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        invalid={invalid}
        valid={valid}
        disabled={disabled}
        readOnly={readOnly}
        data-preview-state={previewState}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          className="ot-field__control"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </Field>
      {helperText && (
        <p id={helperId} className="ot-input__helper">
          {helperText}
        </p>
      )}
    </div>
  )
})
