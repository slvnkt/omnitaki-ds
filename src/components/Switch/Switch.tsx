import { forwardRef, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode } from 'react'

import './Switch.css'

export type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Track size (Figma `Size`): `sm` 28×16 · `md` 36×20 · `lg` 44×24; label Caption / Body 1 / Body 2. @default 'md' */
  size?: SwitchSize
  /** Visible label (Figma `Label` + `Show label`): name the setting, not the state — "Email notifications". Omit only with `aria-label`. */
  label?: ReactNode
  /** On state (controlled, Figma `Checked`). Use with `onChange`; or `defaultChecked` for uncontrolled. */
  checked?: boolean
  /** Initial on state (uncontrolled). */
  defaultChecked?: boolean
  /** Disables the switch: not focusable, keeps its current state. @default false */
  disabled?: boolean
  /** Form field name. Submitted as `value` (default "on") only when on. */
  name?: string
  /** Called when toggled (`event.target.checked`). Apply the setting immediately — a switch has no "Save". */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /** Class name on the root `<label>`. Other props go to the native `<input role="switch">`. */
  className?: string
  /** @internal Forces a visual state for Storybook previews. */
  'data-preview-state'?: 'hover' | 'focus'
}

/** On/off toggle with immediate effect. Native `<input type="checkbox" role="switch">` under a token-styled track. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { size = 'md', label, className, 'data-preview-state': previewState, ...rest },
  ref,
) {
  const classes = ['ot-switch', `ot-switch--${size}`, className].filter(Boolean).join(' ')
  return (
    <label className={classes} data-preview-state={previewState}>
      <span className="ot-switch__control">
        <input ref={ref} type="checkbox" role="switch" className="ot-switch__input" {...rest} />
        <span className="ot-switch__track" aria-hidden="true">
          <span className="ot-switch__thumb" />
        </span>
      </span>
      {label && <span className="ot-switch__label">{label}</span>}
    </label>
  )
})
