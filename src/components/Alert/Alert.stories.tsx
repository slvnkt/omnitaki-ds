import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Button } from '../Button'
import { Alert, type AlertIntent } from './Alert'

const INTENTS: AlertIntent[] = ['info', 'success', 'warning', 'danger', 'neutral']
const COPY: Record<AlertIntent, [string, string, string]> = {
  info: ['Data is being recalculated', 'Numbers for Nov 14–16 may change as late reports arrive.', 'Learn more'],
  success: ['Delivery completed', 'The campaign reached 100% of planned impressions.', 'View'],
  warning: ['Data is delayed', 'The latest data is from Nov 16. Updates usually arrive within 24 hours.', 'Why?'],
  danger: ["Couldn't load data", 'Something went wrong on our side. Try again in a moment.', 'Retry'],
  neutral: ['Figures were revised', 'Totals changed after reconciliation with the ad server.', 'Details'],
}

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=189-343' },
  },
  args: { intent: 'warning', variant: 'inline', title: COPY.warning[0], children: COPY.warning[1] },
  argTypes: {
    intent: { control: 'inline-radio', options: INTENTS },
    variant: { control: 'inline-radio', options: ['inline', 'banner'] },
    action: { control: false },
    icon: { control: false },
  },
  decorators: [Story => <div style={{ width: 440 }}><Story /></div>],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Five intents. Status is carried by the icon and the words, not only by color.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
      {INTENTS.map(i => <Alert key={i} intent={i} title={COPY[i][0]}>{COPY[i][1]}</Alert>)}
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Inline vs banner',
  parameters: story('Inline sits inside a card (radius, full border). Banner spans the full width of its container (no radius, bottom border, more padding).'),
  decorators: [Story => <div style={{ width: 640 }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xl)' }}>
      <Alert intent="info" variant="banner" title="Data is being recalculated">Numbers for Nov 14–16 may change.</Alert>
      <div style={{ padding: 'var(--ot-spacing-padding-lg)', border: 'var(--ot-card-border-width) solid var(--ot-color-border-primary)', borderRadius: 'var(--ot-card-radius)' }}>
        <Alert intent="warning" title="Data is delayed">The latest data is from Nov 16.</Alert>
      </div>
    </div>
  ),
}

export const States: Story = {
  parameters: story('Default, with action, dismissible, without title. Action and dismiss show their own hover/focus states.'),
  render: function StatesStory() {
    const [shown, setShown] = useState(true)
    return (
      <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)' }}>
        <Alert intent="warning" title="Data is delayed">The latest data is from Nov 16.</Alert>
        <Alert intent="warning" title="Data is delayed" action={<Button variant="ghost" size="sm" onClick={fn()}>Why?</Button>}>The latest data is from Nov 16.</Alert>
        {shown ? (
          <Alert intent="info" title="Figures were revised" onDismiss={() => setShown(false)}>Totals changed after reconciliation.</Alert>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setShown(true)}>Show dismissed alert</Button>
        )}
        <Alert intent="danger" action={<Button variant="ghost" size="sm">Retry</Button>}>Couldn't load data. Try again in a moment.</Alert>
      </div>
    )
  },
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Intent × Variant as in the Figma set (with action and dismiss), Light and Dark.') },
  decorators: [Story => <Story />],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(360px, 1fr))', gap: 'var(--ot-spacing-gap-lg)' }}>
          {INTENTS.map(i => (
            <div key={i} style={{ display: 'contents' }}>
              <Alert intent={i} title={COPY[i][0]} action={<Button variant="ghost" size="sm">{COPY[i][2]}</Button>} onDismiss={fn()}>{COPY[i][1]}</Alert>
              <Alert intent={i} variant="banner" title={COPY[i][0]}>{COPY[i][1]}</Alert>
            </div>
          ))}
        </ThemePanel>
      ))}
    </div>
  ),
}
