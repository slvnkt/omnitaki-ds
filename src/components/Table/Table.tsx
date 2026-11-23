import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUp } from '@phosphor-icons/react'

import { EmptyState } from '../EmptyState'
import { Progress } from '../Progress'
import { Skeleton } from '../Skeleton'
import './Table.css'

export type SortDirection = 'asc' | 'desc'
export interface TableSort {
  /** Column key. */
  key: string
  /** Direction. */
  direction: SortDirection
}

export interface TableColumn<T> {
  /** Unique key; also the row field used for default rendering and built-in sorting. */
  key: string
  /** Header content (Figma `TableHeaderCell` label). Keep it short. */
  header: ReactNode
  /** `right` for numbers so digits line up (Figma `Align`). @default 'left' */
  align?: 'left' | 'right'
  /** Fixed column width, e.g. `120` or `'30%'`. */
  width?: number | string
  /** Header becomes a sort button with `aria-sort`. */
  sortable?: boolean
  /** Custom cell content. Use the helpers: `NumberCell`, `TwoLineCell`, `ProgressCell`, `Badge`. */
  render?: (row: T, index: number) => ReactNode
  /** Value used for built-in sorting when it differs from `row[key]`. */
  sortValue?: (row: T) => string | number
  /** Content of this column in the total row (`tfoot`). */
  footer?: ReactNode
}

export interface TableProps<T> {
  /** Column definitions. */
  columns: TableColumn<T>[]
  /** Data rows. */
  rows: T[]
  /** Stable key per row. @default index */
  getRowKey?: (row: T, index: number) => string | number
  /** Row height: `compact` 32 · `default` 40 (Figma `Density`). @default 'default' */
  density?: 'compact' | 'default'
  /** Table name (Figma `Caption`). Always give one; set `hideCaption` when a Card title already shows it. */
  caption: ReactNode
  /** Keeps the caption for screen readers only. @default false */
  hideCaption?: boolean
  /** Controlled sort state. */
  sort?: TableSort | null
  /** Initial sort when uncontrolled. */
  defaultSort?: TableSort | null
  /** Called with the next sort. When `sort` is not controlled the table also sorts rows itself. */
  onSortChange?: (sort: TableSort) => void
  /** Makes rows clickable (Enter / Space too) with hover and focus states. */
  onRowClick?: (row: T, index: number) => void
  /** Accessible name for a clickable row, e.g. "Open Summer launch". */
  rowLabel?: (row: T) => string
  /** Keys of selected rows (`brand/secondary` background). */
  selectedKeys?: Array<string | number>
  /** Skeleton rows instead of data (Figma `State=Loading`). @default false */
  loading?: boolean
  /** Number of skeleton rows. @default 5 */
  loadingRows?: number
  /** Content when `rows` is empty (Figma `State=Empty`). Defaults to a compact `EmptyState` "No data". */
  empty?: ReactNode
  /** Sticky header when the wrapper scrolls; pair with `maxHeight`. @default false */
  stickyHeader?: boolean
  /** Max height of the scroll area, e.g. `320`. */
  maxHeight?: number | string
  /** Extra class on the wrapper. */
  className?: string
}

function compare(a: unknown, b: unknown) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true })
}

/**
 * Compact data table for cards (up to ~50 rows). Native `<table>` with `scope`d headers, `aria-sort`,
 * optional total row, clickable / selected rows, loading skeleton, empty state and sticky header.
 */
export function Table<T extends object>({
  columns,
  rows,
  getRowKey = (_row, i) => i,
  density = 'default',
  caption,
  hideCaption = false,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  onRowClick,
  rowLabel,
  selectedKeys = [],
  loading = false,
  loadingRows = 5,
  empty,
  stickyHeader = false,
  maxHeight,
  className,
}: TableProps<T>) {
  const [innerSort, setInnerSort] = useState<TableSort | null>(defaultSort)
  const controlled = sortProp !== undefined
  const sort = controlled ? sortProp : innerSort

  const toggle = (key: string) => {
    const next: TableSort = { key, direction: sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc' }
    if (!controlled) setInnerSort(next)
    onSortChange?.(next)
  }

  let shown = rows
  if (sort && !controlled) {
    const col = columns.find(c => c.key === sort.key)
    const get = col?.sortValue ?? ((r: T) => (r as Record<string, unknown>)[sort.key])
    shown = [...rows].sort((a, b) => compare(get(a), get(b)) * (sort.direction === 'asc' ? 1 : -1))
  }
  const hasFooter = columns.some(c => c.footer !== undefined)
  const wrapClasses = ['ot-table-wrap', density === 'compact' && 'ot-table-wrap--compact', stickyHeader && 'ot-table-wrap--sticky', className].filter(Boolean).join(' ')
  const wrapStyle: CSSProperties | undefined = maxHeight !== undefined ? { maxHeight } : undefined

  const onKey = (e: KeyboardEvent<HTMLTableRowElement>, row: T, i: number) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onRowClick?.(row, i)
    }
  }

  return (
    <div className={wrapClasses} style={wrapStyle} tabIndex={maxHeight !== undefined ? 0 : undefined} aria-busy={loading || undefined}>
      <table className="ot-table">
        <caption className={['ot-table__caption', hideCaption && 'ot-table__caption--hidden'].filter(Boolean).join(' ')}>{caption}</caption>
        <colgroup>
          {columns.map(c => <col key={c.key} style={c.width !== undefined ? { width: c.width } : undefined} />)}
        </colgroup>
        <thead>
          <tr>
            {columns.map(c => {
              const sorted = sort?.key === c.key ? sort.direction : undefined
              const ariaSort = c.sortable ? (sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none') : undefined
              return (
                <th key={c.key} scope="col" data-align={c.align} aria-sort={ariaSort} className={c.sortable ? 'ot-table__th--sortable' : undefined}>
                  {c.sortable ? (
                    <button type="button" className="ot-table__sort" onClick={() => toggle(c.key)}>
                      <span>{c.header}</span>
                      <span className="ot-table__sort-icon" aria-hidden="true">{sorted === 'asc' ? <ArrowUp weight="bold" /> : <ArrowDown weight="bold" />}</span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }, (_, r) => (
              <tr key={r}>
                {columns.map((c, ci) => (
                  <td key={c.key} data-align={c.align}>
                    <Skeleton size="md" width={c.align === 'right' ? '48px' : ci === 0 ? '70%' : '50%'} style={c.align === 'right' ? { marginLeft: 'auto' } : undefined} />
                  </td>
                ))}
              </tr>
            ))
          ) : shown.length === 0 ? (
            <tr>
              <td className="ot-table__empty-cell" colSpan={columns.length}>
                {empty ?? <EmptyState size="compact" title="No data" description="There is nothing to show for these filters." titleAs="p" />}
              </td>
            </tr>
          ) : (
            shown.map((row, i) => {
              const key = getRowKey(row, i)
              const selected = selectedKeys.includes(key)
              return (
                <tr
                  key={key}
                  data-selected={selected || undefined}
                  className={onRowClick ? 'ot-table__row--clickable' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  aria-label={onRowClick && rowLabel ? rowLabel(row) : undefined}
                  onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                  onKeyDown={onRowClick ? e => onKey(e, row, i) : undefined}
                >
                  {columns.map((c, ci) => (
                    <td key={c.key} data-align={c.align}>
                      {ci === 0 && selected && <span className="ot-table__sr">Selected: </span>}
                      {c.render ? c.render(row, i) : String((row as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
        {hasFooter && !loading && shown.length > 0 && (
          <tfoot>
            <tr>
              {columns.map((c, ci) =>
                ci === 0 ? (
                  <th key={c.key} scope="row" data-align={c.align}>{c.footer}</th>
                ) : (
                  <td key={c.key} data-align={c.align}>{c.footer}</td>
                ),
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

/** Number with a muted unit, right-aligned in a `align: 'right'` column. Tabular figures. */
export function NumberCell({ value, unit }: { value: ReactNode; unit?: ReactNode }) {
  return (
    <span className="ot-table-number">
      <span>{value}</span>
      {unit && <span className="ot-table-number__unit">{unit}</span>}
    </span>
  )
}

/** Primary text with a secondary line under it (dates, IDs). Use with the default density. */
export function TwoLineCell({ primary, secondary }: { primary: ReactNode; secondary: ReactNode }) {
  return (
    <span className="ot-table-two-line">
      <span>{primary}</span>
      <span className="ot-table-two-line__secondary">{secondary}</span>
    </span>
  )
}

/** Mini Progress (size sm, no legend) with the percentage next to it. */
export function ProgressCell({ value, max = 100, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <span className="ot-table-progress">
      <Progress size="sm" max={max} segments={[{ value: Math.min(value, max), label: label ?? `${pct}%` }]} showLegend={false} ariaLabel={label ?? `${pct}%`} />
      <span className="ot-table-progress__value" aria-hidden="true">{pct}%</span>
    </span>
  )
}
