export interface PdfIncluded {
  cover: boolean
  projectInfo: boolean
  floorPlans: boolean
  estimate: boolean
  renders: boolean
}

export interface PdfEstimateRow {
  code: string
  name: string
  quantity: number
  unit: string
  amount: string
}

export interface PdfEstimatePart {
  key: string
  label: string
  rows: PdfEstimateRow[]
  subtotal: string
}

export interface PdfFloorRoom {
  key: string
  label: string
  x: number
  y: number
  w: number
  h: number
  color: string
}

export interface PdfFloor {
  key: string
  label: string
  rooms: PdfFloorRoom[]
}

export interface PdfRender {
  id: string
  url: string
  room: string
  caption: string
}

export interface PdfInfoRow {
  label: string
  value: string
}

export interface PdfDocumentData {
  brand: string
  contactPhone: string
  contactWebsite: string
  exportedAtLabel: string
  included: PdfIncluded
  cover: {
    projectName: string
    projectNameLabel: string
    houseType: string
    houseTypeLabel: string
    clientName: string
    clientNameLabel: string
  }
  projectInfo: {
    title: string
    projectName: string
    rows: PdfInfoRow[]
  }
  floorPlans: {
    title: string
    floors: PdfFloor[]
  }
  estimate: {
    title: string
    tabsHint: string
    parts: PdfEstimatePart[]
    columns: {
      code: string
      item: string
      quantity: string
      unit: string
      amount: string
    }
    totalLabel: string
    total: string
  }
  renders: {
    title: string
    empty: string
    items: PdfRender[]
  }
  footer: {
    pageLabel: string
  }
}
