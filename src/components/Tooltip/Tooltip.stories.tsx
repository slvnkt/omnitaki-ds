import type { Meta, StoryObj } from '@storybook/react-vite'
import { Info } from '@phosphor-icons/react'

import { ThemePanel } from '../../docs/DocBlocks'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { Term, Tooltip, TooltipContent, type TooltipPlacement } from './Tooltip'

const PLACEMENTS: TooltipPlacement[] = ['top', 'bottom', 'left', 'right']
const ROWS = [
  { label: 'Confirmed', value: '12.4M', color: 'var(--ot-color-chart-1)' },
  { label: 'Preliminary', value: '3.1M', color: 'var(--ot-color-chart-3)' },
]

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=188-131' },
  },
  args: { text: 'Reconciled with the ad server; will not change.', variant: 'dark', placement: 'top', delay: 300, children: <Button variant="secondary">Hover or focus me</Button> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['dark', 'light'] },
    placement: { control: 'inline-radio', options: PLACEMENTS },
    children: { control: false },
    rows: { control: false },
  },
  decorators: [Story => <div style={{ padding: 'var(--ot-spacing-section-md)' }}><Story /></div>],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Dark — short one-line hints. Light — chart values and multi-line content with "label · value" rows.'),
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ot-spacing-section-lg)', paddingTop: 'var(--ot-spacing-section-md)' }}>
      <Tooltip open text="Final numbers"><Button variant="secondary">Dark</Button></Tooltip>
      <Tooltip open variant="light" title="Nov 16" rows={ROWS}><Button variant="secondary">Light</Button></Tooltip>
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Placement',
  parameters: story('Top (default), bottom, left, right. If there is no room, the tooltip flips to the opposite side.'),
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 'var(--ot-spacing-section-lg) 160px', padding: 'var(--ot-spacing-section-md) 160px' }}>
      {PLACEMENTS.map(p => (
        <Tooltip key={p} open placement={p} text={`Placement: ${p}`}>
          <Button variant="secondary" size="sm">{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const States: Story = {
  parameters: story('Closed until hover or focus (after ~300 ms; instant when moving between triggers); Escape closes. Term: default, hover, focus.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xl)' }}>
      <div style={{ display: 'flex', gap: 'var(--ot-spacing-gap-md)' }}>
        {['Impressions', 'Reach', 'Frequency'].map(l => (
          <Tooltip key={l} text={`Definition of ${l.toLowerCase()}`}><IconButton variant="ghost" size="sm" icon={<Info />} label={`About ${l}`} /></Tooltip>
        ))}
      </div>
      <p className="ot-text-body-body-1" style={{ margin: 0, color: 'var(--ot-color-text-primary)' }}>
        <Term definition="Reconciled with the ad server; will not change.">Confirmed impressions</Term>{' · '}
        <Term data-preview-state="hover" definition="—">Hover</Term>{' · '}
        <Term data-preview-state="focus" definition="—">Focus</Term>
      </p>
    </div>
  ),
}

export const TermStory: Story = {
  name: 'Term',
  parameters: story('Inline term with a dotted underline. Focusable with Tab; the definition opens on hover and focus.'),
  render: () => (
    <p className="ot-text-body-body-1" style={{ maxWidth: 420, margin: 0, color: 'var(--ot-color-text-primary)' }}>
      The campaign delivered 36.2M <Term definition="Impressions reconciled with the ad server. They will not change.">confirmed impressions</Term> and 4.1M{' '}
      <Term definition="Real-time numbers that may change for up to 72 hours.">preliminary</Term> ones through Nov 16.
    </p>
  ),
}

export const ChartContent: Story = {
  name: 'Chart tooltip content',
  parameters: story('`TooltipContent` without positioning — pass it to Recharts / shadcn charts as the tooltip content so charts use the same surface.'),
  render: () => <TooltipContent variant="light" title="Nov 16" rows={ROWS} />,
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Variant × Placement as in the Figma set (open), Light and Dark.') },
  decorators: [Story => <Story />],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'auto repeat(4, 280px)', alignItems: 'center', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-section-lg)', paddingBlock: 'var(--ot-spacing-section-lg)' }}>
          <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
          {PLACEMENTS.map(p => <span key={p} className="ot-text-caption-caption-strong">{p}</span>)}
          {(['dark', 'light'] as const).map(variant => (
            <div key={variant} style={{ display: 'contents' }}>
              <span className="ot-text-caption-caption">{variant}</span>
              {PLACEMENTS.map(p => (
                <div key={p} style={{ display: 'flex', justifyContent: 'center', paddingBlock: 'var(--ot-spacing-section-sm)' }}>
                  <Tooltip open placement={p} variant={variant} title={variant === 'light' ? 'Nov 16' : undefined} text={variant === 'dark' ? 'Final numbers' : undefined} rows={variant === 'light' ? ROWS : undefined}>
                    <Button variant="secondary" size="sm">Trigger</Button>
                  </Tooltip>
                </div>
              ))}
            </div>
          ))}
        </ThemePanel>
      ))}
    </div>
  ),
}
