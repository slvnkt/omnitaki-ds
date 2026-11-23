import type { Meta, StoryObj } from '@storybook/react-vite'

import { ThemePanel } from '../../docs/DocBlocks'
import { Skeleton, type SkeletonShape, type SkeletonSize } from './Skeleton'

const SHAPES: SkeletonShape[] = ['text', 'block', 'circle']
const SIZES: SkeletonSize[] = ['sm', 'md', 'lg']

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=187-37' },
  },
  args: { shape: 'text', size: 'md', width: 240, animation: 'shimmer' },
  argTypes: {
    shape: { control: 'inline-radio', options: SHAPES },
    size: { control: 'inline-radio', options: SIZES },
    animation: { control: 'inline-radio', options: ['shimmer', 'pulse', 'none'] },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Variants: Story = {
  parameters: story('Three shapes: text line, block (charts, images) and circle (avatar, icon).'),
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ot-spacing-gap-xl)' }}>
      <Skeleton shape="text" width={160} />
      <Skeleton shape="block" width={160} height={80} />
      <Skeleton shape="circle" size="lg" />
    </div>
  ),
}

export const Sizes: Story = {
  parameters: story('Text lines 12 / 16 / 20 replace Caption / Body 1 / Body 2; circles 24 / 32 / 40.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-lg)' }}>
      {SIZES.map(s => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ot-spacing-gap-lg)' }}>
          <Skeleton shape="circle" size={s} />
          <Skeleton shape="text" size={s} width={200} />
        </div>
      ))}
    </div>
  ),
}

export const States: Story = {
  parameters: story('Motion: shimmer (default), pulse, none. All become static with prefers-reduced-motion.'),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-lg)', width: 240 }}>
      {(['shimmer', 'pulse', 'none'] as const).map(a => (
        <div key={a} style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xs)' }}>
          <span className="ot-text-caption-caption" style={{ color: 'var(--ot-color-text-secondary)' }}>{a}</span>
          <Skeleton animation={a} />
        </div>
      ))}
    </div>
  ),
}

export const CardComposition: Story = {
  name: 'Composition · Card + Stat + bar',
  parameters: story('Skeleton of a delivery card: the same geometry as the loaded Card with a Stat (L) and a Progress bar, so nothing jumps when data arrives.'),
  render: () => (
    <div aria-busy="true" aria-label="Loading delivery" style={{ width: 400, display: 'grid', gap: 'var(--ot-card-size-md-gap)', padding: 'var(--ot-card-size-md-padding)', borderRadius: 'var(--ot-card-radius)', border: 'var(--ot-card-border-width) solid var(--ot-color-border-primary)', background: 'var(--ot-color-bg-primary)' }}>
      <div style={{ display: 'grid', gap: 'var(--ot-card-header-gap)' }}>
        <Skeleton size="lg" width="45%" />
        <Skeleton size="sm" width="60%" />
      </div>
      <div style={{ display: 'grid', gap: 'var(--ot-stat-gap)' }}>
        <Skeleton size="sm" width={120} />
        <Skeleton shape="block" width={200} height="var(--ot-typography-heading-2xl-line-height)" />
        <Skeleton size="sm" width={100} />
      </div>
      <Skeleton shape="block" height="var(--ot-progress-size-md-height)" />
    </div>
  ),
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Every Shape × Size as in the Figma set, Light and Dark.') },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, auto)', alignItems: 'center', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-xl)' }}>
          <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
          {SIZES.map(s => <span key={s} className="ot-text-caption-caption-strong">{s}</span>)}
          {SHAPES.map(shape => (
            <div key={shape} style={{ display: 'contents' }}>
              <span className="ot-text-caption-caption">{shape}</span>
              {SIZES.map(s => (shape === 'block' && s !== 'md' ? <span key={s} /> : <Skeleton key={s} shape={shape} size={s} width={shape === 'text' ? 160 : 160} height={shape === 'block' ? 80 : undefined} />))}
            </div>
          ))}
        </ThemePanel>
      ))}
    </div>
  ),
}
