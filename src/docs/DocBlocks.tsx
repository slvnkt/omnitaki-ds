import type { CSSProperties, ReactNode } from 'react'

/** Shared building blocks for component Guidelines (MDX). Styled with Omnitaki tokens only. */

export function Row({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--ot-spacing-gap-md)', minWidth: 0, ...style }}>
      {children}
    </div>
  )
}

export function Stack({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ display: 'grid', gap: 'var(--ot-spacing-gap-md)', width: '100%', maxWidth: 280, ...style }}>{children}</div>
}

export function Rules({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--ot-spacing-gap-lg)',
        margin: '16px 0 32px',
      }}
    >
      {children}
    </div>
  )
}

export function Rule({ kind, title, children, example }: { kind: 'do' | 'dont'; title: string; children: ReactNode; example: ReactNode }) {
  const ok = kind === 'do'
  return (
    <div
      style={{
        display: 'grid',
        alignContent: 'start',
        gap: 'var(--ot-spacing-gap-md)',
        padding: 'var(--ot-spacing-padding-lg)',
        borderRadius: 'var(--ot-shape-radius-lg)',
        border: 'var(--ot-shape-border-width-sm) solid var(--ot-color-border-primary)',
        borderTop: `var(--ot-shape-border-width-md) solid var(${ok ? '--ot-color-status-success-primary' : '--ot-color-status-danger-primary'})`,
        background: 'var(--ot-color-bg-primary)',
        minWidth: 0,
      }}
    >
      <div
        style={{
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0,
          overflow: 'hidden',
          padding: 'var(--ot-spacing-padding-lg)',
          borderRadius: 'var(--ot-shape-radius-md)',
          background: 'var(--ot-color-bg-secondary)',
        }}
      >
        {example}
      </div>
      <div>
        <div
          className="ot-text-caption-caption-strong"
          style={{ color: `var(${ok ? '--ot-color-status-success-secondary-text' : '--ot-color-status-danger-secondary-text'})` }}
        >
          {ok ? 'Do' : "Don't"}
        </div>
        <div className="ot-text-heading-subtitle-2" style={{ color: 'var(--ot-color-text-primary)' }}>
          {title}
        </div>
        <div className="ot-text-body-body-1" style={{ color: 'var(--ot-color-text-secondary)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Light + Dark side-by-side container for AllVariants stories. */
export function ThemePanel({ theme, children, style }: { theme: 'light' | 'dark'; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      data-theme={theme}
      style={{
        padding: 'var(--ot-spacing-padding-xl)',
        borderRadius: 'var(--ot-shape-radius-lg)',
        background: 'var(--ot-color-bg-primary)',
        color: 'var(--ot-color-text-secondary)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
