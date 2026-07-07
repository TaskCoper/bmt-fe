import type { SVGProps } from 'react'

export type AppartmentIconProps = SVGProps<SVGSVGElement> & {
  shadowFill?: string
  shadowOpacity?: number | string
  roofFill?: string
  bodyFill?: string
  sideFill?: string
  windowFill?: string
  doorFill?: string
  strokeColor?: string
  accentStrokeColor?: string
  detailOpacity?: number | string
  doorDividerOpacity?: number | string
  bodyStrokeWidth?: number | string
  sideStrokeWidth?: number | string
  windowStrokeWidth?: number | string
  doorStrokeWidth?: number | string
  detailStrokeWidth?: number | string
}

export default function AppartmentIcon({
  shadowFill = '#DDE2EA',
  shadowOpacity = 0.75,
  roofFill = '#DDE2EA',
  bodyFill = '#E7EBF0',
  sideFill = '#DDE2EA',
  windowFill = '#DDE2EA',
  doorFill = '#DDE2EA',
  strokeColor = '#9CA8BA',
  accentStrokeColor = '#7F8CA3',
  detailOpacity = 0.45,
  doorDividerOpacity = 0.55,
  bodyStrokeWidth = 4,
  sideStrokeWidth = 4,
  windowStrokeWidth = 3,
  doorStrokeWidth = 4,
  detailStrokeWidth = 4,
  ...props
}: AppartmentIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <ellipse cx='128' cy='190' rx='56' ry='7' fill={shadowFill} opacity={shadowOpacity} />

      <rect x='66' y='58' width='124' height='14' rx='6' fill={roofFill} />
      <rect
        x='74'
        y='70'
        width='108'
        height='114'
        rx='10'
        fill={bodyFill}
        stroke={strokeColor}
        strokeWidth={bodyStrokeWidth}
      />

      <rect
        x='56'
        y='98'
        width='22'
        height='86'
        rx='7'
        fill={sideFill}
        stroke={strokeColor}
        strokeWidth={sideStrokeWidth}
      />
      <rect
        x='178'
        y='98'
        width='22'
        height='86'
        rx='7'
        fill={sideFill}
        stroke={strokeColor}
        strokeWidth={sideStrokeWidth}
      />

      <line
        x1='82'
        y1='104'
        x2='174'
        y2='104'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />
      <line
        x1='82'
        y1='132'
        x2='174'
        y2='132'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />

      <rect
        x='88'
        y='84'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />
      <rect
        x='120'
        y='84'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />
      <rect
        x='152'
        y='84'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='88'
        y='112'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />
      <rect
        x='120'
        y='112'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />
      <rect
        x='152'
        y='112'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='88'
        y='140'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />
      <rect
        x='120'
        y='140'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />
      <rect
        x='152'
        y='140'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='116'
        y='158'
        width='24'
        height='26'
        rx='5'
        fill={doorFill}
        stroke={accentStrokeColor}
        strokeWidth={doorStrokeWidth}
      />
      <line
        x1='128'
        y1='158'
        x2='128'
        y2='184'
        stroke={accentStrokeColor}
        strokeWidth={windowStrokeWidth}
        opacity={doorDividerOpacity}
      />

      <line x1='70' y1='184' x2='186' y2='184' stroke={strokeColor} strokeWidth={detailStrokeWidth} />
    </svg>
  )
}
