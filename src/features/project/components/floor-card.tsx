import { Card } from '@/shared/components/ui'
import { cn } from '@/shared/lib'
import type { ComponentProps, ReactNode } from 'react'

type FloorSpec = {
  label: string
  value: string | number
  suffix?: string
}

type FloorCardData = {
  title: string
  specs: FloorSpec[]
  color: {
    label: string
    value: string
  }
  plan: {
    label: string
    index: number
    total: number
  }
  cta?: {
    label: string
    href: string
  }
}

interface FloorCardProps extends ComponentProps<typeof Card> {
  data: FloorCardData
  action?: ReactNode
  contentClassName?: string
}

const SQUARE_METER_UNIT = {
  base: 'm',
  exponent: '2'
} as const

function SpecSuffix({ suffix }: { suffix?: string }) {
  if (!suffix) return null

  if (suffix === 'm2') {
    return (
      <small className='text-muted-foreground ml-1 text-[11px] font-normal'>
        {SQUARE_METER_UNIT.base}
        <sup>{SQUARE_METER_UNIT.exponent}</sup>
      </small>
    )
  }

  return <small className='text-muted-foreground ml-1 text-[11px] font-normal'>{suffix}</small>
}

function FloorPlanGhost() {
  return (
    <svg
      className='text-secondary-foreground pointer-events-none absolute right-[-38px] bottom-[-44px] h-auto w-[220px] opacity-[0.06]'
      viewBox='0 0 220 150'
      aria-hidden='true'
    >
      <rect x='8' y='8' width='204' height='134' fill='none' stroke='currentColor' strokeWidth='3' />
      <line x1='112' y1='8' x2='112' y2='78' stroke='currentColor' strokeWidth='2' />
      <line x1='112' y1='78' x2='212' y2='78' stroke='currentColor' strokeWidth='2' />
      <line x1='60' y1='78' x2='60' y2='142' stroke='currentColor' strokeWidth='2' />
      <path d='M112 142 A26 26 0 0 1 86 116' fill='none' stroke='currentColor' strokeWidth='2' />
    </svg>
  )
}

function FloorCardMark() {
  return (
    <svg className='text-secondary-foreground size-6 shrink-0' viewBox='0 0 26 26' aria-hidden='true'>
      <line x1='2' y1='24' x2='2' y2='4' stroke='currentColor' strokeWidth='1.4' />
      <line x1='2' y1='24' x2='22' y2='24' stroke='currentColor' strokeWidth='1.4' />
      <path
        d='M2 4 A20 20 0 0 1 22 24'
        className='stroke-primary motion-reduce:[stroke-dashoffset:0] fill-none transition-[stroke-dashoffset] duration-700 ease-out [stroke-dasharray:34] [stroke-dashoffset:34] group-hover/floor-card:[stroke-dashoffset:0] motion-reduce:transition-none'
        strokeWidth='1.4'
      />
    </svg>
  )
}

export default function FloorCard({ data, action, children, className, contentClassName, ...props }: FloorCardProps) {
  const normalizedColor = data.color.value.toUpperCase()

  return (
    <Card
      className={cn(
        'group/floor-card relative gap-0 overflow-hidden p-4 text-secondary-foreground',
        'hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className
      )}
      {...props}
    >
      <FloorPlanGhost />

      <div className='relative z-10 flex items-start justify-between gap-4'>
        <div className='flex min-w-0 items-center gap-2'>
          <FloorCardMark />
          <h2 className='font-display m-0 truncate text-lg leading-tight font-semibold tracking-[-0.015em]'>
            {data.title}
          </h2>
        </div>
        {action ? <div className='shrink-0'>{action}</div> : null}
      </div>

      <div className='relative z-10 mt-5 mb-3.5 h-2.25 border-b border-border bg-[linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[length:15px_100%]' />

      <div className='relative z-10 mb-4 flex gap-6.5'>
        {data.specs.map((spec) => (
          <div key={spec.label}>
            <div className='text-muted-foreground font-mono text-xs leading-snug'>{spec.label}</div>
            <div className='mt-1 text-lg leading-snug font-medium'>
              {spec.value}
              <SpecSuffix suffix={spec.suffix} />
            </div>
          </div>
        ))}
      </div>

      <div className='relative z-10 flex items-center gap-2.5'>
        <div
          className='size-10 shrink-0 rounded-[7px] border border-border shadow-inner'
          style={{ backgroundColor: normalizedColor }}
          aria-hidden='true'
        />
        <div className='min-w-0 flex-1'>
          <div className='text-muted-foreground font-mono text-xs leading-snug'>{data.color.label}</div>
          <div className='font-mono mt-0.5 text-[13px] leading-snug tracking-[0.02em] uppercase'>{normalizedColor}</div>
        </div>
      </div>

      {/* <div className='relative z-10 mt-[22px] flex items-center justify-between gap-4'>
        <span className='text-muted-foreground font-mono text-[10px] tracking-[0.1em] whitespace-nowrap uppercase'>
          {data.plan.label} {String(data.plan.index).padStart(2, '0')} / {String(data.plan.total).padStart(2, '0')}
        </span>
        {data.cta ? (
          <a
            className='font-mono inline-flex items-center gap-1.5 text-[11px] tracking-[0.04em] text-secondary-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary focus-visible:outline-none'
            href={data.cta.href}
          >
            {data.cta.label}
            <ArrowRight className='size-3.5 transition-transform duration-300 group-hover/floor-card:translate-x-0.5 motion-reduce:transition-none' />
          </a>
        ) : null}
      </div> */}

      {children ? (
        <div className={cn('relative z-10 mt-5 border-t border-border pt-5', contentClassName)}>{children}</div>
      ) : null}
    </Card>
  )
}

export type { FloorCardData, FloorCardProps, FloorSpec }
