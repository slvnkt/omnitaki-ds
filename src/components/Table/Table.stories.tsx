import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ArrowDown, ArrowUp } from '@phosphor-icons/react'
import { fn } from 'storybook/test'

import { ThemePanel } from '../../docs/DocBlocks'
import { Badge, type BadgeVariant } from '../Badge'
import { Button } from '../Button'
import { Card, CardBody, CardHeader } from '../Card'
import { EmptyState } from '../EmptyState'
import { NumberCell, ProgressCell, Table, TwoLineCell, type TableColumn, type TableProps } from './Table'

type Campaign = { id: string; name: string; dates: string; status: 'Live' | 'Paused' | 'Ended'; impressions: number; delivery: number; ctr: number }

const ROWS: Campaign[] = [
  { id: 'c1', name: 'Summer launch — TV', dates: 'Nov 1 – Nov 30', status: 'Live', impressions: 12.4, delivery: 76, ctr: 1.8 },
  { id: 'c2', name: 'Holiday retargeting', dates: 'Nov 15 – Dec 24', status: 'Live', impressions: 9.1, delivery: 42, ctr: 2.4 },
  { id: 'c3', name: 'Brand awareness — CTV', dates: 'Oct 1 – Oct 31', status: 'Ended', impressions: 11.2, delivery: 100, ctr: 0.9 },
  { id: 'c4', name: 'Audio — Podcasts', dates: 'Nov 10 – Dec 10', status: 'Paused', impressions: 4.5, delivery: 31, ctr: 1.2 },
]
const STATUS: Record<Campaign['status'], BadgeVariant> = { Live: 'success', Paused: 'warning', Ended: 'neutral' }

const COLUMNS: TableColumn<Campaign>[] = [
  { key: 'name', header: 'Campaign', sortable: true, render: r => r.name, footer: 'Total' },
  { key: 'status', header: 'Status', width: 96, render: r => <Badge variant={STATUS[r.status]}>{r.status}</Badge> },
  { key: 'impressions', header: 'Impressions', align: 'right', sortable: true, width: 128, render: r => <NumberCell value={r.impressions.toFixed(1)} unit="M" />, footer: <NumberCell value="37.2" unit="M" /> },
  { key: 'delivery', header: 'Delivery', sortable: true, width: 168, render: r => <ProgressCell value={r.delivery} label={`Delivery ${r.delivery}%`} /> },
  { key: 'ctr', header: 'CTR', align: 'right', sortable: true, width: 88, render: r => <NumberCell value={r.ctr.toFixed(1)} unit="%" />, footer: <NumberCell value="1.7" unit="%" /> },
]
const TWO_LINE: TableColumn<Campaign>[] = [{ ...COLUMNS[0], render: r => <TwoLineCell primary={r.name} secondary={r.dates} /> }, ...COLUMNS.slice(1)]

const base: TableProps<Campaign> = { columns: COLUMNS, rows: ROWS, getRowKey: r => r.id, caption: 'Delivery by campaign' }

const meta = {
  title: 'Components/Table',
  component: Table<Campaign>,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: 'https://www.figma.com/design/1AGw3pl5kRF2TU29bS6Egb/Omnitaki-DS?node-id=203-936' },
  },
  args: { ...base, defaultSort: { key: 'impressions', direction: 'desc' } },
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'default'] },
    columns: { control: false },
    rows: { control: false },
    caption: { control: 'text' },
    empty: { control: false },
    sort: { control: false },
    defaultSort: { control: false },
  },
  decorators: [Story => <div style={{ width: 720 }}><Story /></div>],
} satisfies Meta<typeof Table<Campaign>>

export default meta
type Story = StoryObj<typeof meta>

const story = (text: string) => ({ docs: { description: { story: text } } })
const grid = { display: 'grid', gap: 'var(--ot-spacing-section-sm)' } as const

export const Default: Story = {}

export const Variants: Story = {
  name: 'Cell types',
  parameters: story('Text, Two-line (name + dates), Badge, Number with a muted unit (right-aligned, tabular figures), mini Progress. Footer total row in Label M on bg/secondary.'),
  render: () => <Table {...base} columns={TWO_LINE} />,
}

export const Sizes: Story = {
  name: 'Density',
  parameters: story('Compact rows 32 for dense cards, default 40. The header row is 32 in both. Two-line cells need the default density.'),
  render: () => (
    <div style={grid}>
      <Table {...base} density="compact" caption="Compact · 32" />
      <Table {...base} density="default" caption="Default · 40" />
    </div>
  ),
}

export const States: Story = {
  parameters: story('Sortable headers (click or Enter), clickable rows with hover / focus (Tab, then Enter), a selected row, loading skeleton, empty state and a sticky header in a scroll area.'),
  render: function StatesStory() {
    const [selected, setSelected] = useState<string>('c2')
    return (
      <div style={grid}>
        <Table {...base} caption="Clickable rows, one selected" selectedKeys={[selected]} onRowClick={r => setSelected(r.id)} rowLabel={r => `Select ${r.name}`} />
        <Table {...base} caption="Loading" loading loadingRows={4} />
        <Table {...base} caption="Empty" rows={[]} empty={<EmptyState size="compact" title="No campaigns for this period" description="Try a different date range." titleAs="p" actions={<Button variant="secondary" size="sm" onClick={fn()}>Clear filters</Button>} />} />
        <Table {...base} caption="Sticky header (scroll)" rows={[...ROWS, ...ROWS.map(r => ({ ...r, id: `${r.id}b` })), ...ROWS.map(r => ({ ...r, id: `${r.id}c` }))]} stickyHeader maxHeight={240} />
      </div>
    )
  },
}

export const InCard: Story = {
  name: 'Inside a Card',
  parameters: story('In a Card the title already names the table, so the caption is hidden visually but kept for screen readers.'),
  render: () => (
    <Card>
      <CardHeader title="Delivery by campaign" subtitle="Nov 1 – Nov 30" />
      <CardBody><Table {...base} hideCaption density="compact" defaultSort={{ key: 'impressions', direction: 'desc' }} /></CardBody>
    </Card>
  ),
}

function HeaderStates() {
  const cell = { padding: 0 }
  const states = [
    ['Sortable', 'none', undefined],
    ['Sortable · hover', 'none', 'hover'],
    ['Sortable · focus', 'none', 'focus'],
    ['Ascending', 'ascending', undefined],
    ['Descending', 'descending', undefined],
  ] as const
  return (
    <div className="ot-table-wrap">
    <table className="ot-table" style={{ width: 'auto' }}>
      <thead>
        <tr>
          {states.map(([label, sort, preview]) => (
            <th key={label} scope="col" aria-sort={sort} className="ot-table__th--sortable" style={cell}>
              <button type="button" className="ot-table__sort" data-preview-state={preview} tabIndex={-1}>
                <span>{label}</span>
                <span className="ot-table__sort-icon" aria-hidden="true">{sort === 'ascending' ? <ArrowUp weight="bold" /> : <ArrowDown weight="bold" />}</span>
              </button>
            </th>
          ))}
        </tr>
      </thead>
    </table>
    </div>
  )
}

export const AllVariants: Story = {
  parameters: { layout: 'padded', controls: { disable: true }, ...story('Density × State (default with hover / selected / focus rows, loading, empty) and header sort states, Light and Dark.') },
  decorators: [Story => <Story />],
  render: () => (
    <div style={grid}>
      {(['light', 'dark'] as const).map(theme => (
        <ThemePanel key={theme} theme={theme} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(680px, 1fr))', gap: 'var(--ot-spacing-gap-xl)', alignItems: 'start' }}>
          <div style={{ gridColumn: '1 / -1' }}><HeaderStates /></div>
          {(['compact', 'default'] as const).map(density => (
            <div key={density} style={{ display: 'grid', gap: 'var(--ot-spacing-gap-xl)' }}>
              <PreviewRows density={density} />
              <Table {...base} density={density} caption={`${density} · loading`} loading loadingRows={3} />
              <Table {...base} density={density} caption={`${density} · empty`} rows={[]} />
            </div>
          ))}
        </ThemePanel>
      ))}
    </div>
  ),
}

/** Rows forced into hover / selected / focus for the static matrix. */
function PreviewRows({ density }: { density: 'compact' | 'default' }) {
  return (
    <div
      ref={el => {
        const trs = el?.querySelectorAll('tbody tr')
        trs?.[1]?.setAttribute('data-preview-state', 'hover')
        trs?.[3]?.setAttribute('data-preview-state', 'focus')
      }}
    >
      <Table {...base} density={density} caption={`${density} · default, hover, selected, focus`} selectedKeys={['c3']} onRowClick={fn()} />
    </div>
  )
}
