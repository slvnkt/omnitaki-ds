import type { Meta, StoryObj } from '@storybook/react-vite'

import { ThemePanel } from '../../docs/DocBlocks'
import { Progress, type ProgressProps } from './Progress'

const DELIVERY: ProgressProps = {
  max: 60,
  label: 'Delivered 36.2M',
  caption: 'Goal 48.0M',
  segments: [
    { value: 32.1, fill: 'solid', label: 'Confirmed 32.1M' },
    { value: 4.1, fill: 'hatch', label: 'Preliminary 4.1M' },
  ],
  ghost: { from: 36.2, to: 44, label: 'Forecast 44.0M' },
  markers: [
    { value: 40, type: 'marker', label: 'Expected 40.0M' },
    { value: 48, type: 'target', label: 'Goal 48.0M' },
  ],
}

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=199-600' },
  },
  args: DELIVERY,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    caption: { control: 'text' },
  },
  decorators: [Story => <div style={{ width: 480 }}><Story /></div>],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })
const grid = { display: 'grid', gap: 'var(--ot-spacing-section-sm)' } as const

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Single value (meter), confirmed + preliminary, with forecast and markers, over-delivery (max above the goal) and custom chart colors.'),
  render: () => (
    <div style={grid}>
      <Progress label="Budget spent 62%" caption="of $120K" segments={[{ value: 62, label: 'Spent 62%' }]} showLegend={false} />
      <Progress max={60} label="Delivered 36.2M" caption="Goal 48.0M" segments={DELIVERY.segments} markers={[{ value: 48, label: 'Goal 48.0M' }]} showMarkerLabels={false} />
      <Progress {...DELIVERY} />
      <Progress
        max={120}
        label="Delivered 112%"
        caption="Goal 100%"
        segments={[{ value: 100, label: 'Confirmed 100%' }, { value: 12, fill: 'hatch', label: 'Preliminary 12%' }]}
        markers={[{ value: 100, label: 'Goal 100%' }]}
      />
      <Progress
        label="Spend by channel"
        segments={[
          { value: 40, color: 'var(--ot-color-chart-1)', label: 'Display 40%' },
          { value: 25, color: 'var(--ot-color-chart-2)', label: 'Video 25%' },
          { value: 15, color: 'var(--ot-color-chart-4)', label: 'Audio 15%' },
          { value: 10, color: 'var(--ot-color-chart-5)', label: 'CTV 10%' },
        ]}
      />
    </div>
  ),
}

export const Sizes: Story = {
  parameters: story('S 8 · M 12 · L 16 px. S fits table cells and dense cards, M is the default, L is for a single hero metric.'),
  render: () => (
    <div style={grid}>
      {(['sm', 'md', 'lg'] as const).map(s => <Progress key={s} {...DELIVERY} size={s} label={`Size ${s.toUpperCase()}`} showLegend={false} />)}
    </div>
  ),
}

export const States: Story = {
  parameters: story('Default, empty (no data yet: track and goal only), muted (inactive entity), loading and interactive (hover or Tab through segments for a tooltip; the others dim).'),
  render: () => (
    <div style={grid}>
      <Progress {...DELIVERY} label="Default" />
      <Progress max={60} label="Empty · not started" caption="Goal 48.0M" markers={[{ value: 48, label: 'Goal 48.0M' }]} showLegend={false} />
      <Progress {...DELIVERY} label="Muted · paused" muted />
      <Progress {...DELIVERY} loading />
      <Progress {...DELIVERY} label="Interactive" interactive />
    </div>
  ),
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Sizes × states as in the Figma set, Light and Dark.') },
  decorators: [Story => <Story />],
  render: () => (
    <div style={grid}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))', gap: 'var(--ot-spacing-gap-xl)' }}>
          {(['sm', 'md', 'lg'] as const).map(s => (
            <div key={s} style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xl)', alignContent: 'start' }}>
              <Progress {...DELIVERY} size={s} label={`${s.toUpperCase()} · Default`} />
              <Progress {...DELIVERY} size={s} label={`${s.toUpperCase()} · Muted`} muted />
              <Progress max={60} size={s} label={`${s.toUpperCase()} · Empty`} markers={[{ value: 48, label: 'Goal 48.0M' }]} showLegend={false} />
              <Progress {...DELIVERY} size={s} loading />
            </div>
          ))}
        </ThemePanel>
      ))}
    </div>
  ),
}
