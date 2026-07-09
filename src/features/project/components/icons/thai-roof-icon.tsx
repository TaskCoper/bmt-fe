import type { SVGProps } from 'react'

export type ThaiRoofIconProps = SVGProps<SVGSVGElement> & {
  roofFill?: string
  roofSideFill?: string
  ridgeFill?: string
  strokeColor?: string
  accentStrokeColor?: string
  roofTileOpacity?: number | string
  detailOpacity?: number | string
  roofStrokeWidth?: number | string
  detailStrokeWidth?: number | string
}

export default function ThaiRoofIcon({
  roofFill = '#DDE2EA',
  roofSideFill = '#D1D8E3',
  ridgeFill = '#E7EBF0',
  strokeColor = '#9CA8BA',
  accentStrokeColor = '#7F8CA3',
  roofTileOpacity = 0.38,
  detailOpacity = 0.5,
  roofStrokeWidth = 4,
  detailStrokeWidth = 4,
  ...props
}: ThaiRoofIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M128 54L146 92H110Z' fill={ridgeFill} stroke={strokeColor} strokeWidth={roofStrokeWidth} />

      <path
        d='M42 142C74 116 104 94 128 70C152 94 182 116 214 142C197 138 184 143 170 156H86C72 143 59 138 42 142Z'
        fill={roofFill}
        stroke={strokeColor}
        strokeWidth={roofStrokeWidth}
      />

      <path
        d='M62 154C84 138 106 128 128 128C150 128 172 138 194 154L178 170H78Z'
        fill={roofSideFill}
        stroke={strokeColor}
        strokeWidth={roofStrokeWidth}
      />

      <path d='M78 170H178L166 182H90Z' fill={ridgeFill} stroke={strokeColor} strokeWidth={roofStrokeWidth} />

      <path d='M58 142C52 146 46 152 40 160' stroke={strokeColor} strokeWidth={roofStrokeWidth} />

      <path d='M198 142C204 146 210 152 216 160' stroke={strokeColor} strokeWidth={roofStrokeWidth} />

      <path
        d='M88 140C102 128 116 120 128 112C140 120 154 128 168 140'
        stroke={accentStrokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={roofTileOpacity}
      />

      <path
        d='M104 154C114 148 122 145 128 142C134 145 142 148 152 154'
        stroke={accentStrokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={roofTileOpacity}
      />

      <line
        x1='128'
        y1='70'
        x2='128'
        y2='180'
        stroke={accentStrokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />

      <path
        d='M112 94L128 70L144 94'
        stroke={accentStrokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />
    </svg>
  )
}
