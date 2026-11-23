import type { Meta, StoryObj } from '@storybook/react-vite'
import { DotsThree } from '@phosphor-icons/react'

import { ThemePanel } from '../../docs/DocBlocks'
import { Alert } from '../Alert'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { Stat } from '../Stat'
import { Card, CardBody, CardDivider, CardFooter, CardHeader, type CardProps } from './Card'

type Demo = { variant?: CardProps['variant']; padding?: CardProps['padding']; state?: 'default' | 'loading' | 'error'; divider?: boolean }

function DeliveryCard({ variant = 'default', padding = 'md', state = 'default', divider = false }: Demo) {
  return (
    <Card variant={variant} padding={padding} style={{ width: 400 }}>
      <CardHeader
        title="Campaign delivery"
        subtitle="Summer launch · Nov 1 – Nov 30"
        action={<Badge variant={variant === 'muted' ? 'neutral' : 'success'}>{variant === 'muted' ? 'Paused' : 'Live'}</Badge>}
      />
      <CardBody loading={state === 'loading'}>
        {state === 'error' ? (
          <Alert intent="danger" title="Could not load delivery" action={<Button variant="ghost" size="sm">Retry</Button>}>Something went wrong on our side.</Alert>
        ) : (
          <Stat size="lg" label="Delivered impressions" value="36.2" unit="M of 48.0M" secondary="through Nov 16" />
        )}
      </CardBody>
      {divider && <CardDivider />}
      <CardFooter meta="Updated 5 min ago">
        <Button variant="ghost" size="sm">View report</Button>
      </CardFooter>
    </Card>
  )
}

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=192-592' },
  },
  args: { variant: 'default', padding: 'md', as: 'section' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outlined', 'muted'] },
    padding: { control: 'inline-radio', options: ['md', 'lg'] },
    as: { control: false },
    children: { control: false },
  },
  render: args => <DeliveryCard variant={args.variant} padding={args.padding} />,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Default (shadow), Outlined (no shadow, dense grids), Muted (inactive entities: paused, archived).'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-gap-xl)' }}>
      <DeliveryCard variant="default" />
      <DeliveryCard variant="outlined" />
      <DeliveryCard variant="muted" />
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Padding',
  parameters: story('Padding and gap MD 16 (default) or LG 24 for roomy hero widgets.'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-gap-xl)', alignItems: 'flex-start' }}>
      <DeliveryCard padding="md" />
      <DeliveryCard padding="lg" />
    </div>
  ),
}

export const States: Story = {
  parameters: story('Loading swaps the body for a skeleton of the same geometry (aria-busy); Error swaps it for an Alert (or an EmptyState for a whole-widget failure). Header and footer stay.'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-gap-xl)', alignItems: 'flex-start' }}>
      <DeliveryCard state="default" divider />
      <DeliveryCard state="loading" />
      <DeliveryCard state="error" />
    </div>
  ),
}

export const WithMenuAction: Story = {
  name: 'Header action: IconButton',
  parameters: story('The right slot can hold a Badge, an IconButton or a Menu trigger.'),
  render: () => (
    <Card style={{ width: 400 }}>
      <CardHeader title="Audience" subtitle="Households reached" action={<IconButton variant="ghost" size="sm" icon={<DotsThree />} label="Audience actions" aria-haspopup="menu" />} />
      <CardBody><Stat size="md" label="Reach" value="12.8" unit="M" /></CardBody>
    </Card>
  ),
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Variant × Padding × State as in the Figma set, Light and Dark.') },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 'var(--ot-spacing-gap-xl)', justifyContent: 'start', alignItems: 'start' }}>
          {(['default', 'muted', 'outlined'] as const).flatMap(variant =>
            (['md', 'lg'] as const).flatMap(padding =>
              (['default', 'loading', 'error'] as const).map(state => <DeliveryCard key={`${variant}-${padding}-${state}`} variant={variant} padding={padding} state={state} />),
            ),
          )}
        </ThemePanel>
      ))}
    </div>
  ),
}
