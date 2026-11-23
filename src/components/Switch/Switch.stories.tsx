import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Switch, type SwitchSize } from './Switch'

const SIZES: SwitchSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'focus', 'disabled'] as const

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=63-530' },
  },
  args: { label: 'Email notifications', size: 'md', disabled: false, onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    className: { control: false },
    'data-preview-state': { table: { disable: true } },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const On: Story = {
  parameters: story('On: brand track, white thumb moves to the end.'),
  args: { defaultChecked: true },
}

export const Sizes: Story = {
  parameters: story('Tracks 28×16 · 36×20 · 44×24 with Caption / Body 1 / Body 2 labels.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
      {SIZES.map(s => (
        <Switch key={s} size={s} label={`Size ${s}`} defaultChecked />
      ))}
    </div>
  ),
}

export const SettingsList: Story = {
  parameters: story('Typical use: a list of settings that apply instantly.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-lg)', width: 280 }}>
      <Switch label="Email notifications" defaultChecked />
      <Switch label="Weekly summary" />
      <Switch label="Two-factor authentication" defaultChecked disabled />
    </div>
  ),
}

export const Disabled: Story = {
  parameters: story('Keeps its state but cannot be changed or focused.'),
  args: { disabled: true, defaultChecked: true },
}

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
      {[false, true].flatMap(checked =>
        SIZES.map(size => (
          <div key={`${checked}-${size}`} style={{ display: 'contents' }}>
            <span className="ot-text-caption-caption">{checked ? 'on' : 'off'} · {size}</span>
            {STATES.map(s => (
              <Switch
                key={s}
                size={size}
                label="Label"
                defaultChecked={checked}
                disabled={s === 'disabled'}
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
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Size × Checked × State as in the Figma set, Light and Dark. Hover and Focus are forced for preview.') },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
