import type { CSSProperties, HTMLAttributes } from 'react'

import './Skeleton.css'

export type SkeletonShape = 'text' | 'block' | 'circle'
export type SkeletonSize = 'sm' | 'md' | 'lg'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Form (Figma `Shape`): `text` — a text line, `block` — a rectangle (chart, image, card),
   * `circle` — avatar or icon.
   * @default 'text'
   */
  shape?: SkeletonShape
  /**
   * Figma `Size`. Text: line height 12 / 16 / 20 (stand-ins for Caption / Body 1 / Body 2).
   * Circle: 24 / 32 / 40. Ignored for `block`.
   * @default 'md'
   */
  size?: SkeletonSize
  /** Width: number (px) or any CSS length — `'60%'`, `'12ch'`. Defaults to 100% for text and block. */
  width?: CSSProperties['width']
  /** Block height: number (px) or CSS length. Use the height of the real content it replaces. */
  height?: CSSProperties['height']
  /** Motion: `shimmer` (default), `pulse` or `none`. Always static with `prefers-reduced-motion`. @default 'shimmer' */
  animation?: 'shimmer' | 'pulse' | 'none'
}

/**
 * Loading placeholder that keeps the geometry of the real content (bg/tertiary).
 * Always `aria-hidden`: put `aria-busy="true"` on the container that is loading.
 */
export function Skeleton({ shape = 'text', size = 'md', width, height, animation = 'shimmer', className, style, ...rest }: SkeletonProps) {
  const classes = ['ot-skeleton', `ot-skeleton--${shape}`, `ot-skeleton--${size}`, animation !== 'none' && `ot-skeleton--${animation}`, className]
    .filter(Boolean)
    .join(' ')
  return <span aria-hidden="true" className={classes} style={{ width: shape === 'circle' ? undefined : width ?? '100%', height, ...style }} {...rest} />
}
