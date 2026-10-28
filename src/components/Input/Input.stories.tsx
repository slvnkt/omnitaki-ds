import type { Meta, StoryObj } from '@storybook/react-vite'
import { At, CheckCircle, MagnifyingGlass, WarningCircle, X } from '@phosphor-icons/react'
import { fn } from 'storybook/test'

import { Input, type InputSize } from './Input'

// Figma slot icons (preferred values of the Field INSTANCE_SWAP props)
const ICONS = {
  None: undefined,
  MagnifyingGlass: <MagnifyingGlass />,
  At: <At />,
  X: <X />,
  WarningCircle: <WarningCircle />,
  CheckCircle: <CheckCircle />,
}
const iconArg = { options: Object.keys(ICONS), mapping: ICONS, control: { type: 'select' } } as const

const SIZES: InputSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'focus', 'filled', 'error', 'success', 'disabled', 'readonly'] as const
type State = (typeof STATES)[number]

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=27-145',
    },
  },
  args: {
    label: 'Email',
    helperText: 'We never share your email.',
    placeholder: 'name@company.com',
    size: 'md',
    invalid: false,
    valid: false,
    disabled: false,
    readOnly: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    leadingIcon: iconArg,
    trailingIcon: iconArg,
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] },
    className: { control: false },
    id: { control: false },
    'data-preview-state': { table: { disable: true } },
  },
  decorators: [
    Story => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Sizes: Story = {
  parameters: story('`sm` 32 · `md` 40 · `lg` 48 — the same heights as Button, so a field and its action align in one row.'),
  render: args => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xl)' }}>
      {SIZES.map(s => (
        <Input key={s} {...args} size={s} label={`Size ${s}`} />
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  parameters: story('Leading icon hints at the content (search, email). Icons are decorative (`aria-hidden`); interactive actions like "clear" need a real button.'),
  args: { label: 'Search', helperText: undefined, placeholder: 'Search projects', type: 'search', leadingIcon: <MagnifyingGlass /> },
}

export const Invalid: Story = {
  name: 'Error',
  parameters: story('`invalid` turns the border and trailing icon red, sets `aria-invalid` and shows `helperText` as the error message.'),
  args: { defaultValue: 'name@company', invalid: true, helperText: 'Enter a valid email, e.g. name@company.com', trailingIcon: <WarningCircle /> },
}

export const Success: Story = {
  parameters: story('`valid` confirms a checked value (e.g. an available username). Use sparingly — most fields need no success state.'),
  args: { label: 'Username', defaultValue: 'nikita', valid: true, helperText: 'Username is available', trailingIcon: <CheckCircle /> },
}

export const Disabled: Story = {
  parameters: story('Not focusable and not submitted. Prefer `readOnly` when users still need to read or copy the value.'),
  args: { disabled: true },
}

export const ReadOnly: Story = {
  parameters: story('Focusable and selectable, value is submitted, but cannot be edited.'),
  args: { readOnly: true, defaultValue: 'nikita@omnitaki.com', helperText: 'Contact support to change your email.' },
}

// Same grid as the Figma set: rows = Size, columns = State; Light and Dark side by side.
const stateProps = (s: State) => ({
  invalid: s === 'error',
  valid: s === 'success',
  disabled: s === 'disabled',
  readOnly: s === 'readonly',
  defaultValue: ['filled', 'error', 'success', 'readonly'].includes(s) ? 'Value' : undefined,
  helperText: s === 'error' ? 'Error message' : s === 'success' ? 'Success message' : 'Helper text',
  'data-preview-state': s === 'hover' || s === 'focus' ? s : undefined,
})

function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div
      data-theme={theme}
      style={{
        display: 'grid',
        gridTemplateColumns: `auto repeat(${STATES.length}, 200px)`,
        alignItems: 'center',
        columnGap: 'var(--ot-spacing-section-sm)',
        rowGap: 'var(--ot-spacing-gap-xl)',
        padding: 'var(--ot-spacing-padding-xl)',
        borderRadius: 'var(--ot-shape-radius-lg)',
        background: 'var(--ot-color-bg-primary)',
        color: 'var(--ot-color-text-secondary)',
      }}
    >
      <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
      {STATES.map(s => (
        <span key={s} className="ot-text-caption-caption-strong">
          {s}
        </span>
      ))}
      {SIZES.map(size => (
        <div key={size} style={{ display: 'contents' }}>
          <span className="ot-text-caption-caption">{size}</span>
          {STATES.map(s => (
            <Input key={s} size={size} label="Label" placeholder="Placeholder" {...stateProps(s)} />
          ))}
        </div>
      ))}
    </div>
  )
}

export const AllVariants: Story = {
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    ...story('Every Size × State as in the Figma set, Light and Dark. Hover and Focus are forced for preview; Filled = has a value.'),
  },
  decorators: [Story => <Story />],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
