import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Card, CardBody, CardHeader } from '../Card'
import { Divider } from '../Divider'
import { Disclosure } from './Disclosure'

const LABEL = 'How delivery is calculated'
const CONTENT = 'Confirmed impressions are reconciled with the ad server daily. Preliminary numbers come from real-time logs and can change for up to 72 hours.'
const FAQ = [
  ['How delivery is calculated', CONTENT],
  ['Why numbers change', 'Late reports from publishers and fraud filtering adjust totals after the fact. Changes are usually below 2%.'],
  ['What "expected" means', 'The share of the goal you should have delivered by today if delivery were even across the flight.'],
] as const

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=206-65' },
  },
  args: { label: LABEL, children: CONTENT, defaultOpen: false, disabled: false, onOpenChange: fn() },
  argTypes: {
    label: { control: 'text' },
    children: { control: 'text' },
    open: { control: false },
    headingLevel: { control: 'inline-radio', options: [undefined, 2, 3, 4] },
    'data-preview-state': { control: false },
  },
  decorators: [Story => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof Disclosure>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  name: 'Accordion',
  parameters: story('Several disclosures separated by Dividers form an accordion. Each opens on its own (multiple can be open), which is the easiest pattern to use.'),
  render: () => (
    <div>
      {FAQ.map(([label, text], i) => (
        <div key={label}>
          {i > 0 && <Divider />}
          <Disclosure label={label} defaultOpen={i === 0} headingLevel={3}>{text}</Disclosure>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  name: 'In a Card',
  parameters: story('One size (40, like md controls). Inside a Card the trigger padding lines up with the card content; the panel text starts at the same x as the label.'),
  render: () => (
    <Card>
      <CardHeader title="Campaign delivery" subtitle="Nov 1 – Nov 30" />
      <CardBody>
        <Disclosure label="Methodology" style={{ marginInline: 'calc(-1 * var(--ot-disclosure-padding-x))' }}>{CONTENT}</Disclosure>
      </CardBody>
    </Card>
  ),
}

export const States: Story = {
  parameters: story('Collapsed, expanded, controlled (external button), disabled. Hover, press and focus (Tab) the triggers to see their states.'),
  render: function StatesStory() {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
        <Disclosure label="Collapsed">{CONTENT}</Disclosure>
        <Disclosure label="Expanded" defaultOpen>{CONTENT}</Disclosure>
        <Disclosure label={`Controlled · ${open ? 'open' : 'closed'}`} open={open} onOpenChange={setOpen}>{CONTENT}</Disclosure>
        <Disclosure label="Disabled" disabled>{CONTENT}</Disclosure>
      </div>
    )
  },
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Expanded × State as in the Figma set, Light and Dark.') },
  decorators: [Story => <Story />],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(220px, 1fr))', gap: 'var(--ot-spacing-gap-lg)', alignItems: 'start' }}>
          {[false, true].map(expanded =>
            (['default', 'hover', 'pressed', 'focus', 'disabled'] as const).map(state => (
              <Disclosure
                key={`${expanded}-${state}`}
                label={`${expanded ? 'Expanded' : 'Collapsed'} · ${state}`}
                open={expanded}
                disabled={state === 'disabled'}
                data-preview-state={state === 'default' || state === 'disabled' ? undefined : state}
              >
                {CONTENT}
              </Disclosure>
            )),
          )}
        </ThemePanel>
      ))}
    </div>
  ),
}
