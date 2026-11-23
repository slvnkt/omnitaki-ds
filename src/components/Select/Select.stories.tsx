import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bank, CreditCard, Wallet } from '@phosphor-icons/react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import type { FieldSize } from '../Field'
import { Select, type SelectOption } from './Select'

const CURRENCIES: SelectOption[] = [
  { value: 'eur', label: 'EUR — Euro' },
  { value: 'usd', label: 'USD — US dollar' },
  { value: 'gbp', label: 'GBP — British pound' },
  { value: 'chf', label: 'CHF — Swiss franc', disabled: true },
  { value: 'pln', label: 'PLN — Polish złoty' },
]
const SIZES: FieldSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'focus', 'filled', 'error', 'success', 'disabled', 'readonly'] as const
type State = (typeof STATES)[number]

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=81-3' },
  },
  decorators: [
    Story => (
      <div style={{ width: 280, minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    options: CURRENCIES,
    label: 'Currency',
    helperText: 'Used for all new invoices.',
    placeholder: 'Select a currency',
    size: 'md',
    invalid: false,
    valid: false,
    disabled: false,
    readOnly: false,
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    options: { control: false },
    leadingIcon: { control: false },
    className: { control: false },
    id: { control: false },
    'data-preview-state': { table: { disable: true } },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Open: Story = {
  parameters: story('Open list: Menu surface 4px below the field; option text aligns with the value (menu padding + row padding = field padding). Selected option has the check.'),
  args: { defaultValue: 'usd', defaultOpen: true },
}

export const Sizes: Story = {
  parameters: story('`sm` 32 · `md` 40 · `lg` 48 — same as Input and Button; option rows use the same size.'),
  decorators: [Story => <div style={{ width: 280 }}><Story /></div>],
  render: args => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xl)' }}>
      {SIZES.map(s => (
        <Select key={s} {...args} size={s} label={`Size ${s}`} defaultValue="eur" />
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  parameters: story('Options can carry an icon; the selected option\'s icon is shown in the field.'),
  args: {
    label: 'Payment method',
    helperText: undefined,
    placeholder: 'Choose a method',
    options: [
      { value: 'card', label: 'Card', icon: <CreditCard /> },
      { value: 'bank', label: 'Bank transfer', icon: <Bank /> },
      { value: 'wallet', label: 'Wallet', icon: <Wallet /> },
    ],
    defaultValue: 'card',
  },
}

export const Invalid: Story = {
  name: 'Error',
  parameters: story('`invalid` + an error message in `helperText`; `aria-invalid` is set on the combobox.'),
  args: { invalid: true, helperText: 'Choose a currency to continue.', required: true },
}

export const Disabled: Story = {
  parameters: story('Not focusable and cannot open. Prefer `readOnly` when the value must stay readable.'),
  args: { disabled: true, defaultValue: 'eur' },
}

export const ReadOnly: Story = {
  parameters: story('Focusable, value visible, list does not open.'),
  args: { readOnly: true, defaultValue: 'eur', helperText: 'Set by your organisation.' },
}

const stateProps = (s: State) => ({
  invalid: s === 'error',
  valid: s === 'success',
  disabled: s === 'disabled',
  readOnly: s === 'readonly',
  defaultValue: ['filled', 'error', 'success', 'readonly'].includes(s) ? 'eur' : undefined,
  helperText: s === 'error' ? 'Error message' : s === 'success' ? 'Success message' : 'Helper text',
  'data-preview-state': s === 'hover' || s === 'focus' ? s : undefined,
})

function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <ThemePanel
      theme={theme}
      style={{ display: 'grid', gridTemplateColumns: `auto repeat(${STATES.length}, 200px)`, alignItems: 'center', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-xl)' }}
    >
      <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
      {STATES.map(s => (
        <span key={s} className="ot-text-caption-caption-strong">{s}</span>
      ))}
      {SIZES.map(size => (
        <div key={size} style={{ display: 'contents' }}>
          <span className="ot-text-caption-caption">{size}</span>
          {STATES.map(s => (
            <Select key={s} size={size} label="Label" placeholder="Select option" options={CURRENCIES} {...stateProps(s)} />
          ))}
        </div>
      ))}
    </ThemePanel>
  )
}

export const AllVariants: Story = {
  decorators: [Story => <Story />],
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Size × State as in the Figma set, Light and Dark. Hover and Focus are forced for preview; Filled = has a value.') },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
