import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartBar, FileText, Gear, Receipt } from '@phosphor-icons/react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Tab, type TabsVariant } from './Tab'
import { Tabs, type TabItem } from './Tabs'

const ITEMS: TabItem[] = [
  { value: 'overview', label: 'Overview', content: 'Account balance, recent activity and alerts.' },
  { value: 'invoices', label: 'Invoices', content: 'All invoices with status and due dates.' },
  { value: 'reports', label: 'Reports', content: 'Monthly and quarterly financial reports.' },
  { value: 'settings', label: 'Settings', content: 'Billing details and notification preferences.' },
]
const VARIANTS: TabsVariant[] = ['underline', 'filled']
const STATES = ['default', 'hover', 'pressed', 'focus', 'disabled'] as const

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=59-97' },
  },
  args: { items: ITEMS, variant: 'underline', label: 'Account sections', onValueChange: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    items: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })

export const Default: Story = {}

export const Filled: Story = {
  parameters: story('Segmented control: switches views of the same content (e.g. Day / Week / Month). Selected tab is raised (`bg/elevated` + `Elevation/sm`).'),
  args: {
    variant: 'filled',
    label: 'Period',
    items: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' },
    ],
  },
}

export const WithIcons: Story = {
  parameters: story('A 16px icon can support the label. Keep icons on all tabs or on none.'),
  args: {
    items: [
      { value: 'overview', label: 'Overview', icon: <ChartBar /> },
      { value: 'invoices', label: 'Invoices', icon: <Receipt /> },
      { value: 'reports', label: 'Reports', icon: <FileText /> },
      { value: 'settings', label: 'Settings', icon: <Gear /> },
    ],
  },
}

export const WithDisabledTab: Story = {
  parameters: story('Disabled tabs are skipped by arrow keys. Prefer hiding a tab the user can never open.'),
  args: { items: ITEMS.map(i => (i.value === 'reports' ? { ...i, disabled: true } : i)) },
}

function Grid({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <ThemePanel
      theme={theme}
      style={{ display: 'grid', gridTemplateColumns: `auto repeat(${STATES.length}, auto)`, alignItems: 'center', justifyItems: 'start', columnGap: 'var(--ot-spacing-section-sm)', rowGap: 'var(--ot-spacing-gap-xl)' }}
    >
      <span className="ot-text-caption-caption-strong">{theme === 'light' ? 'Light' : 'Dark'}</span>
      {STATES.map(s => (
        <span key={s} className="ot-text-caption-caption-strong">{s}</span>
      ))}
      {VARIANTS.flatMap(v =>
        [false, true].map(selected => (
          <div key={`${v}-${selected}`} style={{ display: 'contents' }}>
            <span className="ot-text-caption-caption">{v} · {selected ? 'selected' : 'unselected'}</span>
            {STATES.map(s => (
              <div
                key={s}
                role="tablist"
                aria-label={`${v} ${s}`}
                style={v === 'filled' ? { padding: 'var(--ot-tabs-filled-list-padding)', borderRadius: 'var(--ot-tabs-filled-list-radius)', background: 'var(--ot-color-bg-secondary)' } : undefined}
              >
                <Tab variant={v} selected={selected} disabled={s === 'disabled'} tabIndex={-1} data-preview-state={s === 'default' || s === 'disabled' ? undefined : s}>
                  Tab
                </Tab>
              </div>
            ))}
          </div>
        )),
      )}
    </ThemePanel>
  )
}

export const AllVariants: Story = {
  parameters: { controls: { disable: true }, ...story('Every Type × Selected × State of the Tab set, Light and Dark. Filled tabs are shown on their grey list. Hover, Pressed and Focus are forced for preview.') },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ot-spacing-section-sm)' }}>
      <Grid theme="light" />
      <Grid theme="dark" />
    </div>
  ),
}
