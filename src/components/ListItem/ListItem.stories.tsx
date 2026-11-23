import type { Meta, StoryObj } from '@storybook/react-vite'
import { CaretRight, Copy, Star } from '@phosphor-icons/react'

import { ThemePanel } from '../../docs/DocBlocks'
import { ListItem, type ListItemSize } from './ListItem'

const SIZES: ListItemSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'focus', 'disabled'] as const
const ICONS = { None: undefined, Star: <Star />, Copy: <Copy />, CaretRight: <CaretRight /> }

const meta = {
  title: 'Components/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=79-201' },
  },
  decorators: [
    Story => (
      <div role="menu" aria-label="Example" style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  args: { children: 'List item', size: 'md', selected: false, disabled: false, role: 'menuitem' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    role: { control: 'inline-radio', options: ['menuitem', 'option', 'menuitemcheckbox', 'menuitemradio'] },
    leadingIcon: { options: Object.keys(ICONS), mapping: ICONS, control: { type: 'select' } },
    trailingIcon: { options: Object.keys(ICONS), mapping: ICONS, control: { type: 'select' } },
    'data-preview-state': { table: { disable: true } },
  },
} satisfies Meta<typeof ListItem>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Selected: Story = {
  parameters: story('Selected = bold check in `brand/secondary-text`, no fill — the hover overlay stays readable on top.'),
  args: { selected: true, role: 'menuitemradio' },
}

export const WithIcons: Story = {
  parameters: story('Leading icon supports the label; trailing caret signals a submenu.'),
  args: { leadingIcon: <Copy />, trailingIcon: <CaretRight />, children: 'Duplicate' },
}

function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <ThemePanel
      theme={theme}
      style={{ display: 'grid', gridTemplateColumns: `auto repeat(${STATES.length}, 200px)`, alignItems: 'center', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-lg)', background: 'var(--ot-color-bg-elevated)' }}
    >
      <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
      {STATES.map(s => (
        <span key={s} className="ot-text-caption-caption-strong">{s}</span>
      ))}
      {SIZES.flatMap(size =>
        [false, true].map(selected => (
          <div key={`${size}-${selected}`} style={{ display: 'contents' }}>
            <span className="ot-text-caption-caption">{size} · {selected ? 'selected' : 'unselected'}</span>
            {STATES.map(s => (
              <div key={s} role="menu" aria-label={`${size} ${s}`}>
                <ListItem size={size} selected={selected} role="menuitemradio" disabled={s === 'disabled'} data-preview-state={s === 'hover' || s === 'focus' ? s : undefined}>
                  List item
                </ListItem>
              </div>
            ))}
          </div>
        )),
      )}
    </ThemePanel>
  )
}

export const AllVariants: Story = {
  decorators: [Story => <Story />],
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Size × Selected × State as in the Figma set, on `bg/elevated` (the Menu surface), Light and Dark.') },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
