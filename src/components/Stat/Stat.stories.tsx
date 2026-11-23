import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Delta, Stat, type StatSize } from './Stat'

const SIZES: StatSize[] = ['sm', 'md', 'lg']
const STATES = ['default', 'hover', 'pressed', 'focus', 'loading', 'unavailable'] as const

const meta = {
  title: 'Components/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=191-332' },
  },
  args: {
    label: 'Delivered impressions',
    value: '36.2',
    unit: 'M of 48.0M',
    secondary: 'through Nov 16',
    size: 'md',
    hint: 'Impressions reconciled with the ad server plus preliminary real-time counts.',
    delta: { value: '+12%', direction: 'up', comparison: 'vs last week' },
    deltaIntent: 'success',
    loading: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    deltaIntent: { control: 'inline-radio', options: ['success', 'danger', 'neutral'] },
    onClick: { control: false },
    icon: { control: false },
    'data-preview-state': { table: { disable: true } },
  },
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Hero figure, KPI row, and a KPI with a delta whose color follows meaning: here fewer preemptions is good, so "down" is success.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      <Stat size="lg" label="Delivered impressions" value="36.2" unit="M of 48.0M" secondary="through Nov 16" />
      <div style={{ display: 'flex', gap: 'var(--ot-spacing-section-sm)' }}>
        <Stat size="sm" label="Delivery" value="75" unit="%" secondary="of plan" />
        <Stat size="sm" label="Preempted spots" value="4" delta={{ value: '−3', direction: 'down', comparison: 'vs last week' }} deltaIntent="success" />
        <Stat size="sm" label="CPM" value="$12.40" delta={{ value: '+8%', direction: 'up', comparison: 'vs plan' }} deltaIntent="danger" />
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  parameters: story('S 20/28 · M 24/32 · L (hero) 40/48. Units are muted and smaller.'),
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--ot-spacing-section-md)' }}>
      {SIZES.map(s => <Stat key={s} size={s} label={`Size ${s}`} value="36.2" unit="M" secondary="through Nov 16" />)}
    </div>
  ),
}

export const States: Story = {
  parameters: story('Clickable (hover, pressed, focus — surface extends 8px outside), loading skeleton with the same geometry, unavailable with a reason in a Tooltip.'),
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ot-spacing-section-sm)', padding: 'var(--ot-spacing-padding-sm)' }}>
      <Stat label="Reach" value="12.8" unit="M" secondary="unique households" onClick={fn()} />
      <Stat label="Reach" value="12.8" unit="M" secondary="unique households" loading />
      <Stat label="Frequency" value="—" secondary="Not available yet" unavailableReason="Frequency is calculated after the first full week of delivery." />
    </div>
  ),
}

export const DeltaStory: Story = {
  name: 'Delta',
  parameters: story('Intent × direction. Choose the intent by meaning; the arrow and sign carry direction, and screen readers hear "up" / "down".'),
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 'var(--ot-spacing-gap-lg) var(--ot-spacing-section-sm)' }}>
      {(['success', 'danger', 'neutral'] as const).flatMap(intent =>
        (['up', 'down', 'flat'] as const).map(d => <Delta key={intent + d} intent={intent} direction={d} value={d === 'up' ? '+12%' : d === 'down' ? '−4%' : '0%'} comparison="vs last week" />),
      )}
    </div>
  ),
}

function Cell({ size, state }: { size: StatSize; state: (typeof STATES)[number] }) {
  const base = { size, label: 'Delivered impressions', value: '36.2', unit: 'M of 48.0M', secondary: 'through Nov 16', hint: 'Definition' }
  if (state === 'loading') return <Stat {...base} loading />
  if (state === 'unavailable') return <Stat {...base} value="—" secondary="Not available yet" unavailableReason="Not reported yet" />
  if (state === 'default') return <Stat {...base} />
  return <Stat {...base} onClick={fn()} data-preview-state={state} />
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Size × State as in the Figma set, Light and Dark. Hover, Pressed and Focus are forced for preview.') },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: `auto repeat(${STATES.length}, auto)`, alignItems: 'start', justifyItems: 'start', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-section-sm)' }}>
          <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
          {STATES.map(s => <span key={s} className="ot-text-caption-caption-strong">{s}</span>)}
          {SIZES.map(size => (
            <div key={size} style={{ display: 'contents' }}>
              <span className="ot-text-caption-caption">{size}</span>
              {STATES.map(s => <Cell key={s} size={size} state={s} />)}
            </div>
          ))}
        </ThemePanel>
      ))}
    </div>
  ),
}
