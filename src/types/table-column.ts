import { VNode } from 'vue'

export interface SearchConfig {
  type:
    | 'input'
    | 'select'
    | 'multiple-select'
    | 'cascader'
    | 'person-select'
    | 'daterange'
    | 'datetimerange'
  prop?: string
  label?: string
  options?: { value: any; label: string; children?: any }[]
  default?: any
  // 表单控件属性
  controlProps?: Record<string, any>
  order?: number
}

export default interface TableColumn {
  prop: string
  label: string
  render?: (row: Record<string, any>) => string | VNode
  searchConfig?: SearchConfig
  sortable?: boolean
  width?: string
  minWidth?: string
  columnProps?: Record<string, any>
  headerTips?: string
}
