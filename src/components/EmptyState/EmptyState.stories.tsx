import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Button } from '../Button'
import { Card, CardBody, CardHeader } from '../Card'
import { EmptyState, type EmptyStateVariant } from './EmptyState'

const VARIANTS: EmptyStateVariant[] = ['no-data', 'error', 'no-access', 'not-started']
const COPY: Record<EmptyStateVariant, [string, string, string]> = {
  'no-data': ['No data for this period', 'Delivery starts showing once the first impressions are reported.', 'Refresh'],
  error: ["Couldn't load delivery", 'Something went wrong on our side. Try again in a moment.', 'Retry'],
  'no-access': ["You don't have access", 'Ask a workspace admin to give you the Reports role.', 'Go back'],
  'not-started': ['Campaign starts Dec 1', 'Delivery data appears after the first day of flight.', 'Edit campaign'],
}
const actions = (v: EmptyStateVariant, size: 'sm' | 'md'): ReactNode => <Button variant="secondary" size={size} onClick={fn()}>{COPY[v][2]}</Button>

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=200-335' },
  },
  args: { variant: 'no-data', size: 'default', title: COPY['no-data'][0], description: COPY['no-data'][1], actions: actions('no-data', 'md') },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: ['compact', 'default'] },
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: false },
    actions: { control: false },
  },
  decorators: [Story => <div style={{ width: 480 }}><Story /></div>],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('No data · Error (danger tint, Retry) · No access · Not started. Each has its own icon and copy.'),
  decorators: [Story => <div style={{ width: 760 }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--ot-spacing-gap-lg)' }}>
      {VARIANTS.map(v => <EmptyState key={v} variant={v} size="compact" title={COPY[v][0]} description={COPY[v][1]} actions={actions(v, 'sm')} />)}
    </div>
  ),
}

export const Sizes: Story = {
  parameters: story('Compact (Subtitle 2, 40 px icon circle, small buttons) sits inside a Card; Default (Subtitle 1, 48 px circle) fills a page or a whole panel.'),
  decorators: [Story => <div style={{ width: 760 }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ot-spacing-gap-lg)', alignItems: 'start' }}>
      <Card>
        <CardHeader title="Campaign delivery" subtitle="Nov 1 – Nov 30" />
        <CardBody><EmptyState size="compact" title={COPY['no-data'][0]} description={COPY['no-data'][1]} actions={actions('no-data', 'sm')} /></CardBody>
      </Card>
      <EmptyState title={COPY['no-data'][0]} description={COPY['no-data'][1]} actions={<><Button variant="secondary" size="md">Refresh</Button><Button size="md">Create campaign</Button></>} />
    </div>
  ),
}

export const States: Story = {
  parameters: story('Title only, with description, with one action, with two actions. Buttons show their own hover and focus states.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-lg)' }}>
      <EmptyState size="compact" title="No results" />
      <EmptyState size="compact" title="No results" description="Try a different date range or remove filters." />
      <EmptyState size="compact" title="No results" description="Try a different date range or remove filters." actions={<Button variant="secondary" size="sm">Clear filters</Button>} />
      <EmptyState size="compact" variant="error" title={COPY.error[0]} description={COPY.error[1]} actions={<><Button variant="ghost" size="sm">Contact support</Button><Button variant="secondary" size="sm">Retry</Button></>} />
    </div>
  ),
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Variant × Size as in the Figma set, Light and Dark.') },
  decorators: [Story => <Story />],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))', gap: 'var(--ot-spacing-gap-lg)' }}>
          {(['compact', 'default'] as const).map(size =>
            VARIANTS.map(v => <EmptyState key={`${size}-${v}`} variant={v} size={size} title={COPY[v][0]} description={COPY[v][1]} actions={actions(v, size === 'compact' ? 'sm' : 'md')} />),
          )}
        </ThemePanel>
      ))}
    </div>
  ),
}
