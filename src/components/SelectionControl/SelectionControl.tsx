import { Check, Minus } from '@phosphor-icons/react'
import { forwardRef, useEffect, useImperativeHandle, useRef, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode } from 'react'

import './SelectionControl.css'

export type SelectionControlType = 'checkbox' | 'radio'
export type SelectionControlSize = 'sm' | 'md' | 'lg'

export interface SelectionControlProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Entity (Figma `Type`): `checkbox` for independent on/off choices, `radio` for one choice from a group. @default 'checkbox' */
  type?: SelectionControlType
  /** Box and label size (Figma `Size`): `sm` 16 · `md` 20 · `lg` 24; label Caption / Body 1 / Body 2. @default 'md' */
  size?: SelectionControlSize
  /** Visible label next to the box (Figma `Label` + `Show label`). Clicking it toggles the control. Omit only with `aria-label`. */
  label?: ReactNode
  /** Checked state (controlled). Use with `onChange`; or `defaultChecked` for uncontrolled. */
  checked?: boolean
  /** Initial checked state (uncontrolled). */
  defaultChecked?: boolean
  /** Checkbox only: mixed state for a parent of partly-selected children (Figma `Checked=Indeterminate`). Announced as "mixed". @default false */
  indeterminate?: boolean
  /** Error state (Figma `State=Error`): danger border/fill and `aria-invalid`. Explain the error in text nearby. @default false */
  invalid?: boolean
  /** Disables the control: not focusable, not submitted. @default false */
  disabled?: boolean
  /** Form field name. Radios of one group share the same `name`. */
  name?: string
  /** Value submitted with the form when checked. */
  value?: string
  /** Called when the user toggles the control (`event.target.checked`). */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /** Class name on the root `<label>`. Other props go to the native `<input>`. */
  className?: string
  /** @internal Forces a visual state for Storybook previews. */
  'data-preview-state'?: 'hover' | 'focus'
}

/**
 * Checkbox and Radio in one component (Figma `SelectionControl`). Renders a native `<input>` under a
 * token-styled box, so keyboard, forms and screen readers behave natively. Prefer the `Checkbox` / `Radio` wrappers.
 */
export const SelectionControl = forwardRef<HTMLInputElement, SelectionControlProps>(function SelectionControl(
  { type = 'checkbox', size = 'md', label, indeterminate = false, invalid = false, className, 'data-preview-state': previewState, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inner.current as HTMLInputElement)
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = type === 'checkbox' && indeterminate
  }, [indeterminate, type])

  const classes = ['ot-selection', `ot-selection--${type}`, `ot-selection--${size}`, invalid && 'ot-selection--invalid', className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classes} data-preview-state={previewState}>
      <span className="ot-selection__control">
        <input ref={inner} type={type} className="ot-selection__input" aria-invalid={invalid || undefined} {...rest} />
        <span className="ot-selection__box" aria-hidden="true">
          {type === 'checkbox' ? (
            <>
              <span className="ot-selection__glyph ot-selection__glyph--check">
                <Check weight="bold" />
              </span>
              <span className="ot-selection__glyph ot-selection__glyph--minus">
                <Minus weight="bold" />
              </span>
            </>
          ) : (
            <span className="ot-selection__dot" />
          )}
        </span>
      </span>
      {label && <span className="ot-selection__label">{label}</span>}
    </label>
  )
})

export type CheckboxProps = Omit<SelectionControlProps, 'type'>
export type RadioProps = Omit<SelectionControlProps, 'type' | 'indeterminate'>

/** Checkbox: independent on/off choice, or select-all with `indeterminate`. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <SelectionControl ref={ref} type="checkbox" {...props} />
})

/** Radio: one choice from a group — give all radios of the group the same `name`, wrap them in `<fieldset>` + `<legend>`. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  return <SelectionControl ref={ref} type="radio" {...props} />
})
