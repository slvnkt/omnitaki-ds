import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Checkbox, Radio, SelectionControl, type SelectionControlSize } from './SelectionControl'

const SIZES: SelectionControlSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'focus', 'disabled', 'error'] as const

const meta = {
  title: 'Components/Selection Control',
  component: SelectionControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=63-318' },
  },
  args: { type: 'checkbox', size: 'md', label: 'Send me product updates', indeterminate: false, invalid: false, disabled: false, onChange: fn() },
  argTypes: {
    type: { control: 'inline-radio', options: ['checkbox', 'radio'] },
    size: { control: 'inline-radio', options: SIZES },
    className: { control: false },
    'data-preview-state': { table: { disable: true } },
  },
} satisfies Meta<typeof SelectionControl>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const CheckboxStates: Story = {
  name: 'Checkbox',
  parameters: story('Unchecked, checked and indeterminate. Independent choices — each checkbox works on its own.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
    </div>
  ),
}

export const SelectAll: Story = {
  parameters: story('The parent checkbox becomes `indeterminate` when only some children are selected.'),
  render: function SelectAllStory() {
    const [items, setItems] = useState({ invoices: true, payments: false, reports: false })
    const values = Object.values(items)
    const all = values.every(Boolean)
    const some = values.some(Boolean)
    return (
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
        <legend className="ot-text-caption-caption-strong" style={{ color: 'var(--ot-color-text-primary)', marginBottom: 'var(--ot-spacing-gap-sm)' }}>
          Export
        </legend>
        <Checkbox
          label="All data"
          checked={all}
          indeterminate={some && !all}
          onChange={e => setItems({ invoices: e.target.checked, payments: e.target.checked, reports: e.target.checked })}
        />
        <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)', paddingLeft: 'var(--ot-spacing-padding-xl)' }}>
          {(Object.keys(items) as (keyof typeof items)[]).map(key => (
            <Checkbox key={key} label={key[0].toUpperCase() + key.slice(1)} checked={items[key]} onChange={e => setItems({ ...items, [key]: e.target.checked })} />
          ))}
        </div>
      </fieldset>
    )
  },
}

export const RadioGroup: Story = {
  parameters: story('One choice from a group: same `name`, wrapped in `<fieldset>` with a `<legend>`. Arrow keys move between options.'),
  render: () => (
    <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
      <legend className="ot-text-caption-caption-strong" style={{ color: 'var(--ot-color-text-primary)', marginBottom: 'var(--ot-spacing-gap-sm)' }}>
        Billing period
      </legend>
      <Radio name="period" value="monthly" label="Monthly" defaultChecked />
      <Radio name="period" value="quarterly" label="Quarterly" />
      <Radio name="period" value="yearly" label="Yearly — save 20%" />
    </fieldset>
  ),
}

export const Sizes: Story = {
  parameters: story('Box 16 / 20 / 24 with Caption / Body 1 / Body 2 label; label line-height equals the box.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
      {SIZES.map(s => (
        <div key={s} style={{ display: 'flex', gap: 'var(--ot-spacing-gap-xl)' }}>
          <Checkbox size={s} label={`Checkbox ${s}`} defaultChecked />
          <Radio size={s} name={`size-${s}`} label={`Radio ${s}`} defaultChecked />
        </div>
      ))}
    </div>
  ),
}

export const Invalid: Story = {
  name: 'Error',
  parameters: story('`invalid` marks a required choice that is missing; pair it with an error message in text.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-sm)' }}>
      <Checkbox invalid required label="I accept the terms of service" aria-describedby="terms-error" />
      <span id="terms-error" className="ot-text-caption-caption" style={{ color: 'var(--ot-color-status-danger-secondary-text)' }}>
        Accept the terms to continue.
      </span>
    </div>
  ),
}

const ROWS = [
  { type: 'checkbox', checked: 'false' },
  { type: 'checkbox', checked: 'true' },
  { type: 'checkbox', checked: 'indeterminate' },
  { type: 'radio', checked: 'false' },
  { type: 'radio', checked: 'true' },
] as const

function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <ThemePanel
      theme={theme}
      style={{ display: 'grid', gridTemplateColumns: `auto repeat(${STATES.length}, auto)`, alignItems: 'center', justifyItems: 'start', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-lg)' }}
    >
      <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
      {STATES.map(s => (
        <span key={s} className="ot-text-caption-caption-strong">{s}</span>
      ))}
      {ROWS.flatMap(row =>
        SIZES.map(size => (
          <div key={`${row.type}-${row.checked}-${size}`} style={{ display: 'contents' }}>
            <span className="ot-text-caption-caption">{row.type} · {row.checked} · {size}</span>
            {STATES.map(s => (
              <SelectionControl
                key={s}
                type={row.type}
                size={size}
                label="Label"
                name={`${theme}-${row.type}-${row.checked}-${size}-${s}`}
                defaultChecked={row.checked !== 'false'}
                indeterminate={row.checked === 'indeterminate'}
                disabled={s === 'disabled'}
                invalid={s === 'error'}
                data-preview-state={s === 'hover' || s === 'focus' ? s : undefined}
              />
            ))}
          </div>
        )),
      )}
    </ThemePanel>
  )
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Type × Checked × Size × State as in the Figma set, Light and Dark. Hover and Focus are forced for preview.') },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
