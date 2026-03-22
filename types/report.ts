export interface ReportCategory {
  id: number
  name: string
  label: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface ReportCategoriesResponse {
  reportCategories: ReportCategory[]
}
