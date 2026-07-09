import { Document, G, Image, Page, Rect, Svg, Text, View } from '@react-pdf/renderer'
import { FLOOR_PLAN_VIEWBOX } from './pdf-floor-layouts'
import { COLORS, pdfStyles as s } from './pdf-styles'
import type { PdfDocumentData, PdfEstimatePart, PdfFloor, PdfInfoRow, PdfRender } from './pdf-types'

interface ProjectProposalPdfProps {
  data: PdfDocumentData
  exportedAt: string
}

function FooterFixed({ data }: { data: PdfDocumentData }) {
  return (
    <View style={s.footer} fixed>
      <View style={s.footerBrand}>
        <Text style={s.footerBrandBadge}>BMT</Text>
        <Text>
          {data.brand} · {data.contactPhone} · {data.contactWebsite}
        </Text>
      </View>
      <Text
        render={({ pageNumber, totalPages }) =>
          data.footer.pageLabel.replace('{current}', String(pageNumber)).replace('{total}', String(totalPages))
        }
      />
    </View>
  )
}

function CoverPage({ data, exportedAt }: { data: PdfDocumentData; exportedAt: string }) {
  return (
    <Page size='A4' style={s.coverPage}>
      <View style={s.coverHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text style={s.brandBadge}>BMT</Text>
          <View style={s.brandInfo}>
            <Text style={{ fontSize: 10, fontWeight: 700, color: COLORS.text }}>{data.brand}</Text>
            <Text>{data.contactPhone}</Text>
            <Text>{data.contactWebsite}</Text>
          </View>
        </View>
        <Text style={s.coverDate}>{exportedAt}</Text>
      </View>

      <View style={s.coverTitleBlock}>
        <Text style={s.coverEyebrow}>{data.cover.projectNameLabel}</Text>
        <Text style={s.coverProjectName}>{data.cover.projectName}</Text>
        <Text style={s.coverMeta}>
          {data.cover.houseTypeLabel}: {data.cover.houseType}
        </Text>
        {data.cover.clientName.trim().length > 0 && (
          <Text style={s.coverClient}>
            {data.cover.clientNameLabel}: <Text style={{ fontWeight: 700 }}>{data.cover.clientName}</Text>
          </Text>
        )}
      </View>

      <FooterFixed data={data} />
    </Page>
  )
}

function ProjectInfoSection({ title, projectName, rows }: { title: string; projectName: string; rows: PdfInfoRow[] }) {
  return (
    <View>
      <Text style={s.sectionTitle}>{title}</Text>
      <Text style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>{projectName}</Text>
      <View style={s.card}>
        {rows.map((row) => (
          <View key={row.label} style={s.infoRow}>
            <Text style={s.infoRowLabel}>{row.label}</Text>
            <Text style={s.infoRowValue}>{row.value}</Text>
          </View>
        ))}
      </View>
      <View style={s.spacer} />
    </View>
  )
}

function FloorPlansSection({
  title,
  floors,
  break: shouldBreak
}: {
  title: string
  floors: PdfFloor[]
  break: boolean
}) {
  return (
    <View break={shouldBreak}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.floorGrid}>
        {floors.map((floor) => (
          <View key={floor.key} style={s.floorCard} wrap={false}>
            <View style={s.floorCardInner}>
              <Svg
                viewBox={`0 0 ${FLOOR_PLAN_VIEWBOX.width} ${FLOOR_PLAN_VIEWBOX.height}`}
                style={{ width: '100%', height: 140 }}
              >
                <Rect
                  x={20}
                  y={20}
                  width={620}
                  height={460}
                  rx={8}
                  fill='none'
                  stroke={COLORS.borderStrong}
                  strokeWidth={2}
                />
                {floor.rooms.map((room) => (
                  <G key={room.key}>
                    <Rect
                      x={room.x}
                      y={room.y}
                      width={room.w}
                      height={room.h}
                      rx={4}
                      fill={room.color}
                      stroke={COLORS.borderStrong}
                      strokeWidth={1.5}
                    />
                    <Text
                      x={room.x + room.w / 2}
                      y={room.y + room.h / 2 + 6}
                      textAnchor='middle'
                      fill={COLORS.brandDark}
                      style={{ fontSize: 14 }}
                    >
                      {room.label}
                    </Text>
                  </G>
                ))}
              </Svg>
              <Text style={s.floorLabel}>{floor.label}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={s.spacer} />
    </View>
  )
}

function EstimatePart({ part, columns }: { part: PdfEstimatePart; columns: PdfDocumentData['estimate']['columns'] }) {
  return (
    <View wrap>
      <Text style={{ fontSize: 12, fontWeight: 700, color: COLORS.brandDark, marginBottom: 6, marginTop: 4 }}>
        {part.label}
      </Text>
      <View style={s.table}>
        <View style={s.tableHeader} fixed>
          <Text style={[s.colCode, { fontSize: 9, fontWeight: 700 }]}>{columns.code}</Text>
          <Text style={[s.colItem, { fontSize: 9, fontWeight: 700 }]}>{columns.item}</Text>
          <Text style={[s.colUnit, { fontSize: 9, fontWeight: 700 }]}>{columns.unit}</Text>
          <Text style={[s.colQty, { fontSize: 9, fontWeight: 700 }]}>{columns.quantity}</Text>
          <Text style={[s.colAmount, { fontSize: 9, fontWeight: 700 }]}>{columns.amount}</Text>
        </View>
        {part.rows.map((row, index) => (
          <View key={row.code} style={[s.tableRow, index === part.rows.length - 1 ? s.tableRowLast : {}]} wrap={false}>
            <Text style={[s.tableCell, s.colCode]}>{row.code}</Text>
            <Text style={[s.tableCell, s.colItem]}>{row.name}</Text>
            <Text style={[s.tableCellMuted, s.colUnit]}>{row.unit}</Text>
            <Text style={[s.tableCell, s.colQty]}>{row.quantity}</Text>
            <Text style={[s.tableCell, s.colAmount, { fontWeight: 600 }]}>{row.amount}</Text>
          </View>
        ))}
      </View>
      <View style={s.subtotalRow}>
        <Text style={s.subtotalLabel}>{part.label}</Text>
        <Text style={s.subtotalValue}>{part.subtotal}</Text>
      </View>
    </View>
  )
}

function EstimateSection({ data, break: shouldBreak }: { data: PdfDocumentData['estimate']; break: boolean }) {
  return (
    <View break={shouldBreak}>
      <Text style={s.sectionTitle}>{data.title}</Text>
      {data.parts.map((part) => (
        <EstimatePart key={part.key} part={part} columns={data.columns} />
      ))}
      <View style={s.totalCard} wrap={false}>
        <Text style={s.totalLabel}>{data.totalLabel}</Text>
        <Text style={s.totalValue}>{data.total}</Text>
      </View>
      <View style={s.spacer} />
    </View>
  )
}

function RendersSection({
  title,
  items,
  empty,
  break: shouldBreak
}: {
  title: string
  items: PdfRender[]
  empty: string
  break: boolean
}) {
  return (
    <View break={shouldBreak}>
      <Text style={s.sectionTitle}>{title}</Text>
      {items.length === 0 ? (
        <Text style={s.emptyRenders}>{empty}</Text>
      ) : (
        <View style={s.rendersGrid}>
          {items.map((render) => (
            <View key={render.id} style={s.renderCell} wrap={false}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
              <Image src={render.url} style={s.renderImage} />
              <Text style={s.renderRoom}>{render.room}</Text>
              {render.caption ? <Text style={s.renderCaption}>{render.caption}</Text> : null}
            </View>
          ))}
        </View>
      )}
      <View style={s.spacer} />
    </View>
  )
}

export function ProjectProposalPdf({ data, exportedAt }: ProjectProposalPdfProps) {
  const { included } = data
  const hasContentAfterCover = included.projectInfo || included.floorPlans || included.estimate || included.renders

  const contentKeys = ['projectInfo', 'floorPlans', 'estimate', 'renders'] as const
  const firstSection = contentKeys.find((key) => included[key])

  return (
    <Document title={data.cover.projectName} author={data.brand}>
      {included.cover && <CoverPage data={data} exportedAt={exportedAt} />}

      {hasContentAfterCover && (
        <Page size='A4' style={s.page}>
          {included.projectInfo && (
            <ProjectInfoSection
              title={data.projectInfo.title}
              projectName={data.projectInfo.projectName}
              rows={data.projectInfo.rows}
            />
          )}
          {included.floorPlans && (
            <FloorPlansSection
              title={data.floorPlans.title}
              floors={data.floorPlans.floors}
              break={firstSection !== 'floorPlans'}
            />
          )}
          {included.estimate && <EstimateSection data={data.estimate} break={firstSection !== 'estimate'} />}
          {included.renders && (
            <RendersSection
              title={data.renders.title}
              items={data.renders.items}
              empty={data.renders.empty}
              break={firstSection !== 'renders'}
            />
          )}
          <FooterFixed data={data} />
        </Page>
      )}
    </Document>
  )
}
