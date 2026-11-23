import type { Meta, StoryObj } from '@storybook/react-vite'
import { CaretDown, Copy, DownloadSimple, PencilSimple, Trash } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Button } from '../Button'
import type { ListItemSize } from '../ListItem'
import { Menu, type MenuItem } from './Menu'

const ACTIONS: MenuItem[] = [
  { value: 'edit', label: 'Edit', leadingIcon: <PencilSimple /> },
  { value: 'duplicate', label: 'Duplicate', leadingIcon: <Copy /> },
  { value: 'download', label: 'Download PDF', leadingIcon: <DownloadSimple /> },
  { value: 'archive', label: 'Archive', disabled: true },
  { value: 'delete', label: 'Delete', leadingIcon: <Trash /> },
]
const SIZES: ListItemSize[] = ['sm', 'md', 'lg']

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=80-135' },
  },
  decorators: [
    Story => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  args: { items: ACTIONS, size: 'md', label: 'Invoice actions', onSelect: fn(), onClose: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    items: { control: false },
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const SingleChoice: Story = {
  parameters: story('Rows with `selected` become `menuitemradio` and show the check — e.g. "Sort by".'),
  args: {
    label: 'Sort by',
    items: [
      { value: 'newest', label: 'Newest first', selected: true },
      { value: 'oldest', label: 'Oldest first', selected: false },
      { value: 'amount', label: 'Amount', selected: false },
    ],
  },
}

export const Dropdown: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Scenario (not a component): Button + Menu 4px below (`--ot-menu-offset`). Enter/Space/↓ opens and focuses the first row; Escape closes and returns focus to the button.',
      },
      source: { type: 'code' },
    },
  },
  decorators: [Story => <div style={{ height: 280 }}><Story /></div>],
  render: function DropdownStory(args) {
    const [open, setOpen] = useState(false)
    const [last, setLast] = useState<string | null>(null)
    const trigger = useRef<HTMLButtonElement>(null)
    const root = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (!open) return
      const close = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
      document.addEventListener('mousedown', close)
      return () => document.removeEventListener('mousedown', close)
    }, [open])
    const closeAndFocus = () => {
      setOpen(false)
      trigger.current?.focus()
    }
    return (
      <div ref={root} style={{ position: 'relative', display: 'inline-block' }}>
        <Button
          ref={trigger}
          variant="secondary"
          trailingIcon={<CaretDown />}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          onKeyDown={e => e.key === 'ArrowDown' && (e.preventDefault(), setOpen(true))}
        >
          Actions
        </Button>
        {open && (
          <Menu
            {...args}
            autoFocus
            style={{ position: 'absolute', top: `calc(100% + var(--ot-menu-offset))`, left: 0, width: 240, zIndex: 1 }}
            onSelect={value => {
              args.onSelect?.(value)
              setLast(value)
              closeAndFocus()
            }}
            onClose={closeAndFocus}
          />
        )}
        {last && (
          <p className="ot-text-caption-caption" style={{ color: 'var(--ot-color-text-secondary)' }} aria-live="polite">
            Selected: {last}
          </p>
        )}
      </div>
    )
  },
}

export const AllVariants: Story = {
  decorators: [Story => <Story />],
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Menu S / M / L as in the Figma set, Light and Dark.') },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--ot-spacing-section-sm)' }}>
          {SIZES.map(size => (
            <div key={size} style={{ width: 240 }}>
              <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'} · {size}</span>
              <Menu size={size} label={`Menu ${size}`} items={ACTIONS} style={{ marginTop: 'var(--ot-spacing-gap-sm)' }} />
            </div>
          ))}
        </ThemePanel>
      ))}
    </div>
  ),
}
