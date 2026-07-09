import { StyleSheet } from '@react-pdf/renderer'

export const COLORS = {
  text: '#1f1d18',
  muted: '#8a8175',
  border: '#e6dfd1',
  borderStrong: '#c9bfa8',
  card: '#ffffff',
  cardMuted: '#faf7ef',
  primary: '#8b5a2b',
  primarySoft: '#f4ead9',
  accent: '#3f6f4c',
  brandDark: '#3a2f22'
} as const

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Be Vietnam Pro',
    fontSize: 10,
    color: COLORS.text,
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
    lineHeight: 1.45
  },
  coverPage: {
    fontFamily: 'Be Vietnam Pro',
    fontSize: 10,
    color: COLORS.text,
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 60,
    backgroundColor: COLORS.cardMuted
  },

  coverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  brandBadge: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.brandDark,
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    paddingTop: 14,
    letterSpacing: 2,
    borderRadius: 4
  },
  brandInfo: { fontSize: 9, color: COLORS.muted, marginLeft: 10 },
  coverDate: { fontSize: 9, color: COLORS.muted, textAlign: 'right' },
  coverTitleBlock: { marginTop: 120 },
  coverEyebrow: {
    fontSize: 9,
    letterSpacing: 3,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 6
  },
  coverProjectName: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.15,
    marginBottom: 8
  },
  coverMeta: { fontSize: 11, color: COLORS.text },
  coverClient: { marginTop: 40, fontSize: 11 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
    color: COLORS.brandDark
  },
  sectionKicker: {
    fontSize: 8,
    color: COLORS.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4
  },

  card: {
    border: `1 solid ${COLORS.border}`,
    borderRadius: 6,
    padding: 12,
    backgroundColor: COLORS.card
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3
  },
  infoRowLabel: { color: COLORS.muted },
  infoRowValue: { fontWeight: 600 },

  floorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6
  },
  floorCard: {
    width: '50%',
    padding: 6
  },
  floorCardInner: {
    border: `1 solid ${COLORS.border}`,
    borderRadius: 6,
    overflow: 'hidden'
  },
  floorLabel: {
    fontSize: 9,
    fontWeight: 600,
    padding: 6,
    borderTop: `1 solid ${COLORS.border}`
  },

  table: {
    border: `1 solid ${COLORS.border}`,
    borderRadius: 4,
    marginBottom: 8
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primarySoft,
    borderBottom: `1 solid ${COLORS.border}`,
    paddingVertical: 5,
    paddingHorizontal: 6
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `0.5 solid ${COLORS.border}`,
    paddingVertical: 4,
    paddingHorizontal: 6
  },
  tableRowLast: { borderBottom: 0 },
  tableCell: { fontSize: 9 },
  tableCellMuted: { fontSize: 9, color: COLORS.muted },
  colCode: { width: '15%', fontFamily: 'Courier' },
  colItem: { flexGrow: 1 },
  colUnit: { width: '12%' },
  colQty: { width: '12%', textAlign: 'right' },
  colAmount: { width: '25%', textAlign: 'right' },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 14
  },
  subtotalLabel: { fontWeight: 700 },
  subtotalValue: { fontWeight: 700, color: COLORS.primary },

  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    marginTop: 4
  },
  totalLabel: { fontSize: 12, fontWeight: 700, color: '#fff' },
  totalValue: { fontSize: 16, fontWeight: 700, color: '#fff' },

  rendersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4
  },
  renderCell: { width: '50%', padding: 4, marginBottom: 6 },
  renderImage: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 4
  },
  renderRoom: { fontSize: 9, fontWeight: 600, marginTop: 4 },
  renderCaption: { fontSize: 8, color: COLORS.muted },
  emptyRenders: {
    fontSize: 10,
    color: COLORS.muted,
    fontStyle: 'italic',
    padding: 24,
    border: `1 dashed ${COLORS.borderStrong}`,
    borderRadius: 6,
    textAlign: 'center'
  },

  footer: {
    position: 'absolute',
    left: 48,
    right: 48,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: COLORS.muted,
    borderTop: `0.5 solid ${COLORS.border}`,
    paddingTop: 8
  },
  footerBrand: { flexDirection: 'row' },
  footerBrandBadge: {
    width: 14,
    height: 14,
    backgroundColor: COLORS.brandDark,
    color: '#fff',
    fontSize: 5,
    fontWeight: 700,
    textAlign: 'center',
    paddingTop: 4,
    letterSpacing: 1,
    borderRadius: 2,
    marginRight: 6
  },
  spacer: { height: 16 }
})
