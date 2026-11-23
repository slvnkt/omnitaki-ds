import type { Meta, StoryObj } from '@storybook/react-vite'

import tokens from './tokens.json'

type Group = Record<string, unknown>

// Collect leaf token paths under a group, e.g. color.bg → ['color-bg-primary', …]
function leaves(group: Group, prefix: string): string[] {
  return Object.entries(group).flatMap(([key, value]) => {
    if (key.startsWith('$')) return []
    const path = `${prefix}-${key}`
    return value && typeof value === 'object' && '$value' in value ? [path] : leaves(value as Group, path)
  })
}

const colorGroups = Object.keys(tokens.color).filter(k => !k.startsWith('$'))
const textStyles = leaves(tokens.text as Group, 'text')

function Swatch({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ot-spacing-gap-md)' }}>
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: 'var(--ot-shape-radius-md)',
          border: 'var(--ot-shape-border-width-sm) solid var(--ot-color-border-primary)',
          background: `var(--ot-${name})`,
        }}
      />
      <code className="ot-text-caption-caption" style={{ color: 'var(--ot-color-text-secondary)' }}>
        --ot-{name}
      </code>
    </div>
  )
}

function SemanticColors() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-section-sm)' }}>
      {colorGroups.map(group => (
        <section key={group}>
          <h3 className="ot-text-heading-subtitle-2" style={{ margin: '0 0 var(--ot-spacing-gap-md)' }}>
            color/{group}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--ot-spacing-gap-md)',
            }}
          >
            {leaves((tokens.color as Group)[group] as Group, `color-${group}`).map(name => (
              <Swatch key={name} name={name} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function TextStyles() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-lg)' }}>
      {textStyles.map(name => (
        <div key={name}>
          <div className={`ot-${name}`}>The quick brown fox jumps over the lazy dog</div>
          <code className="ot-text-caption-caption" style={{ color: 'var(--ot-color-text-secondary)' }}>
            .ot-{name}
          </code>
        </div>
      ))}
    </div>
  )
}

function Elevation() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ot-spacing-section-sm)', padding: 'var(--ot-spacing-padding-xl)', background: 'var(--ot-color-bg-secondary)' }}>
      {['sm', 'md', 'lg'].map(level => (
        <div
          key={level}
          className="ot-text-label-label-m"
          style={{
            width: 160,
            height: 96,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 'var(--ot-shape-radius-lg)',
            background: 'var(--ot-color-bg-elevated)',
            boxShadow: `var(--ot-shadow-${level})`,
          }}
        >
          shadow/{level}
        </div>
      ))}
    </div>
  )
}

function BrandBackgroundDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--ot-spacing-gap-lg)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <div
          key={theme}
          data-theme={theme}
          className="ot-bg-brand"
          style={{
            display: 'grid',
            placeItems: 'center',
            minHeight: 280,
            padding: 'var(--ot-spacing-padding-2xl)',
            borderRadius: 'var(--ot-shape-radius-lg)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: 'var(--ot-spacing-gap-sm)',
              maxWidth: 260,
              padding: 'var(--ot-spacing-padding-xl)',
              borderRadius: 'var(--ot-shape-radius-lg)',
              background: 'var(--ot-color-bg-elevated)',
              boxShadow: 'var(--ot-shadow-sm)',
              color: 'var(--ot-color-text-primary)',
            }}
          >
            <span className="ot-text-heading-subtitle-2">.ot-bg-brand</span>
            <span className="ot-text-body-body-1" style={{ color: 'var(--ot-color-text-secondary)' }}>
              {theme === 'light' ? 'Light' : 'Dark'} · canvas --ot-color-bg-brand, dots --ot-color-bg-brand-pattern every
              --ot-pattern-dot-gap.
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const surfaceCard = {
  display: 'grid',
  alignContent: 'end',
  gap: 'var(--ot-spacing-gap-xs)',
  minHeight: 180,
  padding: 'var(--ot-spacing-padding-xl)',
  borderRadius: 'var(--ot-shape-radius-lg)',
  boxSizing: 'border-box',
} as const

function Surfaces() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-lg)' }}>
      {(['light', 'dark'] as const).map(theme => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--ot-spacing-gap-lg)',
            padding: 'var(--ot-spacing-padding-xl)',
            borderRadius: 'var(--ot-shape-radius-lg)',
            background: 'var(--ot-color-bg-primary)',
          }}
        >
          <div className="ot-bg-brand-strong" style={surfaceCard}>
            <span className="ot-text-heading-h3">Financial infrastructure</span>
            <code className="ot-text-code-code-s">.ot-bg-brand-strong</code>
          </div>
          <div className="ot-bg-gradient-brand" style={surfaceCard}>
            <span className="ot-text-heading-h3">Designed for growth</span>
            <code className="ot-text-code-code-s">.ot-bg-gradient-brand</code>
          </div>
          <div className="ot-surface-dashed" style={{ ...surfaceCard, alignContent: 'center', justifyItems: 'center', color: 'var(--ot-color-text-primary)' }}>
            <span className="ot-text-label-label-m">Drop files here</span>
            <code className="ot-text-code-code-s" style={{ color: 'var(--ot-color-text-secondary)' }}>.ot-surface-dashed</code>
          </div>
          <div className="ot-surface-selected" style={{ ...surfaceCard, background: 'var(--ot-color-bg-elevated)', color: 'var(--ot-color-text-primary)' }}>
            <span className="ot-text-heading-subtitle-2">Pro plan</span>
            <code className="ot-text-code-code-s" style={{ color: 'var(--ot-color-text-secondary)' }}>.ot-surface-selected</code>
          </div>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = { render: () => <SemanticColors /> }
export const Typography: Story = { render: () => <TextStyles /> }
export const Shadows: Story = { render: () => <Elevation /> }
export const BrandBackground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Brand background for marketing, onboarding, empty states and hero areas: add `className="ot-bg-brand"`. Figma: Brand Background component.',
      },
    },
  },
  render: () => <BrandBackgroundDemo />,
}
export const BrandSurfaces: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Navy surface, brand gradient (large text only), dashed placeholder and selected card — utilities from tokens.css. Figma: Brand Surfaces page.',
      },
    },
  },
  render: () => <Surfaces />,
}
