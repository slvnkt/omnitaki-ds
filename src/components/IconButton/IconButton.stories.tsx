import type { Meta, StoryObj } from '@storybook/react-vite'
import { CaretDown, DotsThree, MagnifyingGlass, PencilSimple, Plus, Star, Trash, X } from '@phosphor-icons/react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import type { ButtonSize, ButtonVariant } from '../Button'
import { IconButton } from './IconButton'

const ICONS = { Plus: <Plus />, MagnifyingGlass: <MagnifyingGlass />, CaretDown: <CaretDown />, X: <X />, Star: <Star /> }
const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger']
const SIZES: ButtonSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'pressed', 'focus', 'disabled'] as const

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=57-440' },
  },
  args: { icon: <Plus />, label: 'Add item', variant: 'primary', size: 'md', disabled: false, onClick: fn() },
  argTypes: {
    icon: { options: Object.keys(ICONS), mapping: ICONS, control: { type: 'select' } },
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    className: { control: false },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Same four types as Button. In toolbars and table rows use `ghost`; `primary` only for the main action of an area.'),
  render: args => (
    <div style={{ display: 'flex', gap: 'var(--ot-spacing-gap-md)' }}>
      {VARIANTS.map(v => (
        <IconButton key={v} {...args} variant={v} label={`${v} action`} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  parameters: story('Square 32 · 40 · 48 — equal to Button height of the same size, so they align in one row.'),
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ot-spacing-gap-md)' }}>
      {SIZES.map(s => (
        <IconButton key={s} {...args} size={s} label={`Add item (${s})`} />
      ))}
    </div>
  ),
}

export const Toolbar: Story = {
  parameters: story('Typical use: a row of ghost icon buttons with a clear `label` each.'),
  render: () => (
    <div role="toolbar" aria-label="Row actions" style={{ display: 'flex', gap: 'var(--ot-spacing-gap-xs)' }}>
      <IconButton variant="ghost" icon={<PencilSimple />} label="Edit" />
      <IconButton variant="ghost" icon={<Star />} label="Add to favorites" />
      <IconButton variant="ghost" icon={<Trash />} label="Delete" />
      <IconButton variant="ghost" icon={<DotsThree />} label="More actions" />
    </div>
  ),
}

export const Disabled: Story = {
  parameters: story('Native `disabled`: skipped by Tab and ignores clicks.'),
  args: { disabled: true },
}

function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <ThemePanel
      theme={theme}
      style={{ display: 'grid', gridTemplateColumns: `auto repeat(${STATES.length}, auto)`, alignItems: 'center', justifyItems: 'start', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-xl)' }}
    >
      <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
      {STATES.map(s => (
        <span key={s} className="ot-text-caption-caption-strong">{s}</span>
      ))}
      {VARIANTS.flatMap(v =>
        SIZES.map(size => (
          <div key={`${v}-${size}`} style={{ display: 'contents' }}>
            <span className="ot-text-caption-caption">{v} · {size}</span>
            {STATES.map(s => (
              <IconButton
                key={s}
                variant={v}
                size={size}
                icon={<Plus />}
                label={`${v} ${size} ${s}`}
                disabled={s === 'disabled'}
                data-preview-state={s === 'default' || s === 'disabled' ? undefined : s}
              />
            ))}
          </div>
        )),
      )}
    </ThemePanel>
  )
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Type × Size × State as in the Figma set, Light and Dark. Hover, Pressed and Focus are forced for preview.') },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
