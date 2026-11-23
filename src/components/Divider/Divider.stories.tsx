import type { Meta, StoryObj } from '@storybook/react-vite'

import { ThemePanel } from '../../docs/DocBlocks'
import { Divider } from './Divider'

const SPACINGS = ['none', 'sm', 'md', 'lg'] as const

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=205-30' },
  },
  args: { orientation: 'horizontal', spacing: 'none', decorative: true },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    spacing: { control: 'inline-radio', options: SPACINGS },
  },
  decorators: [Story => <div style={{ width: 280, display: 'flex', flexDirection: 'column' }}><Story /></div>],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })
const Text = ({ children }: { children: string }) => <span className="ot-text-body-body-1" style={{ color: 'var(--ot-color-text-primary)' }}>{children}</span>

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Horizontal between stacked groups; vertical between inline items in a row.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xl)' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}><Text>Delivery</Text><Divider spacing="md" /><Text>Audience</Text></div>
      <div style={{ display: 'flex', alignItems: 'center', height: 24 }}><Text>TV</Text><Divider orientation="vertical" spacing="md" /><Text>CTV</Text><Divider orientation="vertical" spacing="md" /><Text>Digital</Text></div>
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Spacing',
  parameters: story('Spacing on both sides: none · sm 8 · md 12 · lg 16.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-lg)' }}>
      {SPACINGS.map(s => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', background: 'var(--ot-color-bg-secondary)' }}>
          <Text>{`Above (${s})`}</Text><Divider spacing={s} /><Text>Below</Text>
        </div>
      ))}
    </div>
  ),
}

export const States: Story = {
  name: 'Semantics',
  parameters: story('Decorative (default, aria-hidden) vs. semantic separator (role="separator") between groups of content.'),
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text>Group A</Text><Divider spacing="sm" decorative={false} /><Text>Group B</Text>
    </div>
  ),
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Orientation × Spacing as in the Figma set, Light and Dark.') },
  decorators: [Story => <Story />],
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'auto repeat(4, 160px)', alignItems: 'center', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-xl)' }}>
          <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
          {SPACINGS.map(s => <span key={s} className="ot-text-caption-caption-strong">{s}</span>)}
          <span className="ot-text-caption-caption">horizontal</span>
          {SPACINGS.map(s => <div key={s} style={{ display: 'flex', flexDirection: 'column', background: 'var(--ot-color-bg-secondary)' }}><Divider spacing={s} /></div>)}
          <span className="ot-text-caption-caption">vertical</span>
          {SPACINGS.map(s => <div key={s} style={{ display: 'flex', height: 40, background: 'var(--ot-color-bg-secondary)', width: 'fit-content' }}><Divider orientation="vertical" spacing={s} /></div>)}
        </ThemePanel>
      ))}
    </div>
  ),
}
