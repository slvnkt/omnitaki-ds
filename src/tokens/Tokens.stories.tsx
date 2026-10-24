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

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = { render: () => <SemanticColors /> }
export const Typography: Story = { render: () => <TextStyles /> }
export const Shadows: Story = { render: () => <Elevation /> }
