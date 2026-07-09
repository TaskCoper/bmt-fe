import type { SVGProps } from 'react'

export type TumPartIconProps = SVGProps<SVGSVGElement> & {
  platformFill?: string
  platformSideFill?: string
  tumBodyFill?: string
  tumSideFill?: string
  tumRoofFill?: string
  windowFill?: string
  doorFill?: string
  strokeColor?: string
  accentStrokeColor?: string
  railingOpacity?: number | string
  detailOpacity?: number | string
  platformStrokeWidth?: number | string
  bodyStrokeWidth?: number | string
  roofStrokeWidth?: number | string
  windowStrokeWidth?: number | string
  doorStrokeWidth?: number | string
  detailStrokeWidth?: number | string
}

export default function TumPartIcon({
  platformFill = '#E7EBF0',
  platformSideFill = '#DDE2EA',
  tumBodyFill = '#E7EBF0',
  tumSideFill = '#D1D8E3',
  tumRoofFill = '#DDE2EA',
  windowFill = '#DDE2EA',
  doorFill = '#DDE2EA',
  strokeColor = '#9CA8BA',
  accentStrokeColor = '#7F8CA3',
  railingOpacity = 0.55,
  detailOpacity = 0.45,
  platformStrokeWidth = 4,
  bodyStrokeWidth = 4,
  roofStrokeWidth = 4,
  windowStrokeWidth = 3,
  doorStrokeWidth = 4,
  detailStrokeWidth = 4,
  ...props
}: TumPartIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      {/* rooftop terrace slab */}
      <path d='M54 160H202L190 184H66Z' fill={platformFill} stroke={strokeColor} strokeWidth={platformStrokeWidth} />

      <path d='M66 184H190' stroke={strokeColor} strokeWidth={detailStrokeWidth} />

      {/* left terrace railing */}
      <line
        x1='62'
        y1='136'
        x2='96'
        y2='136'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='62'
        y1='148'
        x2='96'
        y2='148'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='66'
        y1='136'
        x2='66'
        y2='160'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='82'
        y1='136'
        x2='82'
        y2='160'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='96'
        y1='136'
        x2='96'
        y2='160'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />

      {/* right terrace railing */}
      <line
        x1='160'
        y1='136'
        x2='194'
        y2='136'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='160'
        y1='148'
        x2='194'
        y2='148'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='160'
        y1='136'
        x2='160'
        y2='160'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='176'
        y1='136'
        x2='176'
        y2='160'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />
      <line
        x1='190'
        y1='136'
        x2='190'
        y2='160'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={railingOpacity}
      />

      {/* small set-back tum room */}
      <rect
        x='98'
        y='86'
        width='60'
        height='74'
        rx='9'
        fill={tumBodyFill}
        stroke={strokeColor}
        strokeWidth={bodyStrokeWidth}
      />

      {/* right side depth */}
      <path d='M158 100H176V160H158Z' fill={tumSideFill} stroke={strokeColor} strokeWidth={bodyStrokeWidth} />

      {/* flat overhanging cap roof */}
      <rect
        x='88'
        y='72'
        width='84'
        height='18'
        rx='7'
        fill={tumRoofFill}
        stroke={strokeColor}
        strokeWidth={roofStrokeWidth}
      />

      <line
        x1='98'
        y1='104'
        x2='158'
        y2='104'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />

      {/* tum door */}
      <rect
        x='116'
        y='120'
        width='24'
        height='40'
        rx='5'
        fill={doorFill}
        stroke={accentStrokeColor}
        strokeWidth={doorStrokeWidth}
      />

      <line
        x1='128'
        y1='120'
        x2='128'
        y2='160'
        stroke={accentStrokeColor}
        strokeWidth={windowStrokeWidth}
        opacity={detailOpacity}
      />

      {/* small tum window */}
      <rect
        x='108'
        y='96'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      <rect
        x='134'
        y='96'
        width='16'
        height='14'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      {/* side small window */}
      <rect
        x='163'
        y='118'
        width='8'
        height='18'
        rx='3'
        fill={windowFill}
        stroke={strokeColor}
        strokeWidth={windowStrokeWidth}
      />

      {/* terrace floor detail */}
      <line
        x1='76'
        y1='170'
        x2='180'
        y2='170'
        stroke={strokeColor}
        strokeWidth={detailStrokeWidth}
        opacity={detailOpacity}
      />
    </svg>
  )
}
