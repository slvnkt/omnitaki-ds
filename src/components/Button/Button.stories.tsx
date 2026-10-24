import type { Meta, StoryObj } from '@storybook/react-vite'
import { CaretDown, MagnifyingGlass, Plus, Star, X } from '@phosphor-icons/react'
import { fn } from 'storybook/test'

import { Button, type ButtonSize, type ButtonVariant } from './Button'

// Figma slot icons (preferred values of the INSTANCE_SWAP props)
const ICONS = {
  None: undefined,
  Plus: <Plus />,
  MagnifyingGlass: <MagnifyingGlass />,
  CaretDown: <CaretDown />,
  X: <X />,
  Star: <Star />,
}
const iconArg = { options: Object.keys(ICONS), mapping: ICONS, control: { type: 'select' } } as const

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger']
const SIZES: ButtonSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'pressed', 'focus', 'disabled'] as const

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=22-32',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    leadingIcon: iconArg,
    trailingIcon: iconArg,
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    className: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('One `primary` per area; `secondary` and `ghost` for the rest; `danger` only for destructive actions.'),
  render: args => (
    <div style={{ display: 'flex', gap: 'var(--ot-spacing-gap-md)' }}>
      {VARIANTS.map(v => (
        <Button key={v} {...args} variant={v}>
          {v[0].toUpperCase() + v.slice(1)}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  parameters: story('`sm` 32 · `md` 40 · `lg` 48 — the same heights as fields, so controls of one size align in a row.'),
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ot-spacing-gap-md)' }}>
      {SIZES.map(s => (
        <Button key={s} {...args} size={s} leadingIcon={<Plus />}>
          Size {s}
        </Button>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  parameters: story('Leading icon reinforces the action; trailing `CaretDown` signals that the button opens a menu. Icons are decorative (`aria-hidden`).'),
  args: { leadingIcon: <Plus />, trailingIcon: <CaretDown />, children: 'Create' },
}

export const Disabled: Story = {
  parameters: story('Native `disabled`: not focusable and ignores clicks. Explain nearby why the action is unavailable.'),
  args: { disabled: true },
}

// Same grid as the Figma set: rows = Type × Size, columns = State; Light and Dark side by side.
function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div
      data-theme={theme}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${STATES.length + 1}, auto)`,
        alignItems: 'center',
        justifyItems: 'start',
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
      {VARIANTS.flatMap(v =>
        SIZES.map(size => (
          <div key={`${v}-${size}`} style={{ display: 'contents' }}>
            <span className="ot-text-caption-caption">
              {v} · {size}
            </span>
            {STATES.map(s => (
              <Button
                key={s}
                variant={v}
                size={size}
                disabled={s === 'disabled'}
                data-preview-state={s === 'default' || s === 'disabled' ? undefined : s}
              >
                Button
              </Button>
            ))}
          </div>
        )),
      )}
    </div>
  )
}

export const AllVariants: Story = {
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    ...story('Every Type × Size × State as in the Figma set, Light and Dark side by side. Hover, Pressed and Focus are forced for preview.'),
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
