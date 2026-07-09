import type { SVGProps } from 'react'

export type TraditionalRoofHouseIconProps = SVGProps<SVGSVGElement> & {
  shadowFill?: string
  shadowOpacity?: number | string
  roofFill?: string
  roofSideFill?: string
  bodyFill?: string
  sideFill?: string
  windowFill?: string
  doorFill?: string
  strokeColor?: string
  accentStrokeColor?: string
  roofTileOpacity?: number | string
  detailOpacity?: number | string
  doorDividerOpacity?: number | string
  roofStrokeWidth?: number | string
  bodyStrokeWidth?: number | string
  sideStrokeWidth?: number | string
  windowStrokeWidth?: number | string
  doorStrokeWidth?: number | string
  detailStrokeWidth?: number | string
}

export default function TraditionalRoofHouseIcon({
  shadowFill = '#DDE2EA',
  shadowOpacity = 0.75,
  roofFill = '#DDE2EA',
  roofSideFill = '#D1D8E3',
  bodyFill = '#E7EBF0',
  sideFill = '#DDE2EA',
  windowFill = '#DDE2EA',
  doorFill = '#DDE2EA',
  strokeColor = '#9CA8BA',
  accentStrokeColor = '#7F8CA3',
  roofTileOpacity = 0.42,
  detailOpacity = 0.45,
  doorDividerOpacity = 0.55,
  roofStrokeWidth = 4,
  bodyStrokeWidth = 4,
  sideStrokeWidth = 4,
  windowStrokeWidth = 3,
  doorStrokeWidth = 4,
  detailStrokeWidth = 4,
  ...props
}: TraditionalRoofHouseIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <ellipse cx='128' cy='190' rx='58' ry='7' fill={shadowFill} opacity={shadowOpacity} />

      <rect
        x='66'
        y='120'
        width='124'
        height='64'
        rx='10'
        fill={bodyFill}
        stroke={strokeColor}
        strokeWidth={bodyStrokeWidth}
      />

      <rect
        x='56'
        y='136'
        width='28'
        height='48'
        rx='7'
        fill={sideFill}
        stroke={strokeColor}
        strokeWidth={sideStrokeWidth}
      />

      <rect
        x='172'
        y='136'
        width='28'
        height='48'
        rx='7'
        fill={sideFill}
        stroke={strokeColor}
        strokeWidth={sideStrokeWidth}
      />

      <path
        d='M48 118L128 62L208 118L198 128L128 80L58 128Z'
        fill={roofFill}
        stroke={strokeColor}
        strokeWidth={roofStrokeWidth}
      />

      <path d='M58 128L128 80L198 128H58Z' fill={roofSideFill} stroke={strokeColor} strokeWidth={roofStrokeWidth} />

      <line
        x1='128'
        y1='64'
        x2='128'
        y2='80'
        stroke={accentStrokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />

      <line
        x1='72'
        y1='118'
        x2='128'
        y2='78'
        stroke={accentStrokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={roofTileOpacity}
      />

      <line
        x1='184'
        y1='118'
        x2='128'
        y2='78'
        stroke={accentStrokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={roofTileOpacity}
      />

      <line
        x1='92'
        y1='128'
        x2='128'
        y2='102'
        stroke={accentStrokeColor}
        strokeWidth={windowStrokeWidth}
        opacity={roofTileOpacity}
      />

      <line
        x1='164'
        y1='128'
        x2='128'
        y2='102'
        stroke={accentStrokeColor}
        strokeWidth={windowStrokeWidth}
        opacity={roofTileOpacity}
      />

      <line
        x1='72'
        y1='148'
        x2='184'
        y2='148'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />

      <rect
        x='84'
        y='136'
        width='20'
        height='16'
        rx='4'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='152'
        y='136'
        width='20'
        height='16'
        rx='4'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='84'
        y='160'
        width='20'
        height='16'
        rx='4'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='152'
        y='160'
        width='20'
        height='16'
        rx='4'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='116'
        y='150'
        width='24'
        height='34'
        rx='5'
        fill={doorFill}
        stroke={accentStrokeColor}
        strokeWidth={doorStrokeWidth}
      />

      <line
        x1='128'
        y1='150'
        x2='128'
        y2='184'
        stroke={accentStrokeColor}
        strokeWidth={windowStrokeWidth}
        opacity={doorDividerOpacity}
      />

      <line x1='62' y1='184' x2='194' y2='184' stroke={strokeColor} strokeWidth={detailStrokeWidth} />
    </svg>
  )
}
