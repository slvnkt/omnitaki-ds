import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckCircle, Clock, Star, WarningCircle, XCircle } from '@phosphor-icons/react'

import { ThemePanel } from '../../docs/DocBlocks'
import { Badge, type BadgeSize, type BadgeVariant } from './Badge'

const ICONS = { None: undefined, Star: <Star />, CheckCircle: <CheckCircle />, WarningCircle: <WarningCircle />, Clock: <Clock />, XCircle: <XCircle /> }
const VARIANTS: BadgeVariant[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info']
const SIZES: BadgeSize[] = ['sm', 'md', 'lg']

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=27-197' },
  },
  args: { children: 'Badge', variant: 'neutral', size: 'md', dot: true },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    icon: { options: Object.keys(ICONS), mapping: ICONS, control: { type: 'select' } },
    className: { control: false },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Six meanings. Color always comes with a word, never alone.'),
  render: args => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-gap-sm)' }}>
      {VARIANTS.map(v => (
        <Badge key={v} {...args} variant={v}>{v[0].toUpperCase() + v.slice(1)}</Badge>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  parameters: story('`sm` 16 for counters and dense tables, `md` 20 default, `lg` 24 next to 40–48px controls.'),
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ot-spacing-gap-sm)' }}>
      {SIZES.map(s => (
        <Badge key={s} {...args} size={s}>Size {s}</Badge>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  parameters: story('A 12px icon replaces the dot when it adds meaning (status icons). Use either a dot or an icon.'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-gap-sm)' }}>
      <Badge variant="success" icon={<CheckCircle />}>Paid</Badge>
      <Badge variant="warning" icon={<Clock />}>Pending</Badge>
      <Badge variant="danger" icon={<XCircle />}>Failed</Badge>
      <Badge variant="brand" icon={<Star />}>New</Badge>
    </div>
  ),
}

export const WithoutDot: Story = {
  parameters: story('`dot={false}` for plain labels such as categories or counts.'),
  args: { dot: false, children: '12' },
}

function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <ThemePanel
      theme={theme}
      style={{ display: 'grid', gridTemplateColumns: `auto repeat(${VARIANTS.length}, auto)`, alignItems: 'center', justifyItems: 'start', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-xl)' }}
    >
      <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
      {VARIANTS.map(v => (
        <span key={v} className="ot-text-caption-caption-strong">{v}</span>
      ))}
      {SIZES.map(size => (
        <div key={size} style={{ display: 'contents' }}>
          <span className="ot-text-caption-caption">{size}</span>
          {VARIANTS.map(v => (
            <Badge key={v} variant={v} size={size}>Badge</Badge>
          ))}
        </div>
      ))}
    </ThemePanel>
  )
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Type × Size as in the Figma set, Light and Dark.') },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
