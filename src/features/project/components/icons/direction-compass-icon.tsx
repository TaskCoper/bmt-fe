import type { SVGProps } from 'react'

type DirectionCompassIconProps = SVGProps<SVGSVGElement> & {
  direction: 'east' | 'west' | 'south' | 'north'
}

export function NorthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 256 256' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
      <ellipse cx='128' cy='194' rx='48' ry='7' fill='#DDE2EA' opacity='0.7' />

      <circle cx='128' cy='128' r='68' fill='#E7EBF0' stroke='#9CA8BA' strokeWidth='4' />
      <circle cx='128' cy='128' r='48' fill='#DDE2EA' stroke='#9CA8BA' strokeWidth='4' opacity='0.85' />

      <path d='M128 58L160 132H142V174H114V132H96Z' fill='#D1D8E3' stroke='#7F8CA3' strokeWidth='4' />

      <circle cx='128' cy='128' r='8' fill='#E7EBF0' stroke='#7F8CA3' strokeWidth='4' />
    </svg>
  )
}

export function EastIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 256 256' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
      <ellipse cx='128' cy='194' rx='48' ry='7' fill='#DDE2EA' opacity='0.7' />

      <circle cx='128' cy='128' r='68' fill='#E7EBF0' stroke='#9CA8BA' strokeWidth='4' />
      <circle cx='128' cy='128' r='48' fill='#DDE2EA' stroke='#9CA8BA' strokeWidth='4' opacity='0.85' />

      <path d='M198 128L124 96V114H82V142H124V160Z' fill='#D1D8E3' stroke='#7F8CA3' strokeWidth='4' />

      <circle cx='128' cy='128' r='8' fill='#E7EBF0' stroke='#7F8CA3' strokeWidth='4' />
    </svg>
  )
}

export function SouthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 256 256' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
      <ellipse cx='128' cy='194' rx='48' ry='7' fill='#DDE2EA' opacity='0.7' />

      <circle cx='128' cy='128' r='68' fill='#E7EBF0' stroke='#9CA8BA' strokeWidth='4' />
      <circle cx='128' cy='128' r='48' fill='#DDE2EA' stroke='#9CA8BA' strokeWidth='4' opacity='0.85' />

      <path d='M128 198L96 124H114V82H142V124H160Z' fill='#D1D8E3' stroke='#7F8CA3' strokeWidth='4' />

      <circle cx='128' cy='128' r='8' fill='#E7EBF0' stroke='#7F8CA3' strokeWidth='4' />
    </svg>
  )
}

export function WestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 256 256' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
      <ellipse cx='128' cy='194' rx='48' ry='7' fill='#DDE2EA' opacity='0.7' />

      <circle cx='128' cy='128' r='68' fill='#E7EBF0' stroke='#9CA8BA' strokeWidth='4' />
      <circle cx='128' cy='128' r='48' fill='#DDE2EA' stroke='#9CA8BA' strokeWidth='4' opacity='0.85' />

      <path d='M58 128L132 96V114H174V142H132V160Z' fill='#D1D8E3' stroke='#7F8CA3' strokeWidth='4' />

      <circle cx='128' cy='128' r='8' fill='#E7EBF0' stroke='#7F8CA3' strokeWidth='4' />
    </svg>
  )
}

export default function DirectionCompassIcon({ direction, ...props }: DirectionCompassIconProps) {
  switch (direction) {
    case 'east':
      return <EastIcon {...props} />
    case 'west':
      return <WestIcon {...props} />
    case 'south':
      return <SouthIcon {...props} />
    case 'north':
      return <NorthIcon {...props} />
  }
}
