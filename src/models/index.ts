export interface FileUpload {
  fileName: string,
  urlDownload: string
}

export interface OptionModel {
  label: string,
  value: string | any,
  color?: string,
  disableValue?: string[]
}

export interface PaginationModel {
  pageNumber: number,
  pageSize: number,
  total: number,
  totalPage: number,
}