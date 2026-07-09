'use client'

import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { useMemo, useRef } from 'react'

export interface TapeStep {
  key: string
  title: string
}

interface TapeStepperProps {
  steps: TapeStep[]
  current: number
  onStepChange: (index: number) => void
  className?: string
  ariaLabel?: string
}

/**
 * Horizontal tape-measure stepper. Each step is one centimetre graduation;
 * a metal clip and amber bubble slide to the active mark. Uses semantic
 * tokens (primary = amber, foreground = ink, secondary = paper).
 */
export function TapeStepper({ steps, current, onStepChange, className, ariaLabel }: TapeStepperProps) {
  const tapeRef = useRef<HTMLDivElement>(null)
  const count = steps.length
  const clampedCurrent = Math.max(0, Math.min(count - 1, current))

  const frac = (i: number) => (count <= 1 ? 0 : i / (count - 1))
  const currentFraction = frac(clampedCurrent)
  const isLastStep = count > 0 && clampedCurrent === count - 1

  const minors = useMemo(() => {
    const marks: { f: number; mid: boolean }[] = []
    const step = count <= 1 ? 0 : 1 / (count - 1)
    for (let i = 0; i < count - 1; i++) {
      for (let k = 1; k < 10; k++) {
        marks.push({ f: i * step + (k / 10) * step, mid: k === 5 })
      }
    }
    return marks
  }, [count])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      onStepChange(Math.min(count - 1, clampedCurrent + 1))
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      onStepChange(Math.max(0, clampedCurrent - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onStepChange(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      onStepChange(count - 1)
    }
  }

  const activeStep = steps[clampedCurrent]

  return (
    <div
      ref={tapeRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role='tablist'
      aria-label={ariaLabel}
      className={cn(
        'focus-visible:ring-ring/40 relative rounded-lg pt-[57.5px] outline-none focus-visible:ring-2',
        '[--tape-pad:2.5rem]',
        className
      )}
    >
      <div
        className={cn(
          'relative h-[62px] overflow-hidden rounded-md border',
          'bg-linear-to-b from-card via-secondary to-secondary/80',
          'shadow-[inset_0_1px_0_theme(colors.white/60%),inset_0_-2px_4px_rgb(0_0_0/6%)]'
        )}
      >
        <div
          className='from-primary/15 to-primary/35 absolute inset-y-0 left-0 bg-linear-to-b transition-[width] duration-[380ms] ease-out'
          style={{
            width: isLastStep ? '100%' : `calc(var(--tape-pad) + (100% - 2 * var(--tape-pad)) * ${currentFraction})`
          }}
          aria-hidden
        />

        <div className='absolute inset-y-0 right-[var(--tape-pad)] left-[var(--tape-pad)]'>
          {minors.map((m, idx) => (
            <div
              key={idx}
              aria-hidden
              className={cn(
                'absolute bottom-2 w-px',
                m.mid ? 'h-4 opacity-80' : 'h-[9px] opacity-55',
                m.f <= currentFraction ? 'bg-primary' : 'bg-muted-foreground'
              )}
              style={{ left: `${m.f * 100}%` }}
            />
          ))}

          {steps.map((s, i) => {
            const reached = i <= clampedCurrent
            return (
              <div key={s.key} className='absolute bottom-2' style={{ left: `${frac(i) * 100}%` }} aria-hidden>
                <div className={cn('-ml-px h-[26px] w-0.5', reached ? 'bg-primary' : 'bg-foreground')} />
                <span
                  className={cn(
                    'absolute -top-5 left-0 -translate-x-1/2 font-mono text-xs font-bold tabular-nums',
                    reached ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {i + 1}
                </span>
              </div>
            )
          })}
        </div>

        <div
          className='from-muted-foreground/30 border-muted-foreground/30 absolute inset-y-0 left-0 w-3 border-r bg-linear-to-r to-transparent'
          aria-hidden
        />
        <div
          className='from-muted-foreground/30 border-muted-foreground/30 absolute inset-y-0 right-0 w-3 border-l bg-linear-to-l to-transparent'
          aria-hidden
        />
      </div>

      <div className='relative mt-2.5 h-9'>
        {steps.map((s, i) => {
          const active = i === clampedCurrent

          return (
            <Button
              key={s.key}
              type='button'
              role='tab'
              size='sm'
              variant='ghost'
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onStepChange(i)}
              className={cn(
                'cursor-pointer hover:bg-secondary absolute top-0 -translate-x-1/2 rounded-md px-2 py-1 text-[12.5px] whitespace-nowrap transition-colors',
                active ? 'text-foreground font-bold' : 'text-muted-foreground font-medium'
              )}
              style={{ left: `calc(var(--tape-pad) + (100% - 2 * var(--tape-pad)) * ${frac(i)})` }}
            >
              {s.title}
            </Button>
          )
        })}
      </div>

      <div
        aria-hidden
        className='pointer-events-none absolute top-[26px] right-[var(--tape-pad)] left-[var(--tape-pad)]'
      >
        <div
          className='absolute flex -translate-x-1/2 flex-col items-center transition-[left] duration-[380ms] ease-out'
          style={{ left: `${currentFraction * 100}%` }}
        >
          <div className='bg-primary text-primary-foreground shadow-primary/40 rounded-md px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider whitespace-nowrap tabular-nums shadow-md'>
            {activeStep?.title}
          </div>
          <div className='border-t-primary h-0 w-0 border-x-[6px] border-x-transparent border-t-[7px]' />
          {/* <div className='border-primary bg-primary/10 -mt-0.5 h-[66px] w-[22px] rounded-sm border-2' /> */}
        </div>
      </div>
    </div>
  )
}
