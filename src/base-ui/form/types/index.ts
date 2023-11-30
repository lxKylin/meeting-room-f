type IFormType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'select'
  | 'datepicker'
  | 'time'
  | 'year'
  | 'dates'
  | 'upload'
  | 'editor'
  | 'file'

export interface IFormItem {
  field: string
  type: IFormType
  label: string
  rule?: any[]
  required?: boolean
  advice?: string
  placeholder?: any
  // 针对select
  options?: any[]
  // 针对特殊的属性
  otherOptions?: any
  isHidden?: boolean
}

export interface IPropList {
  prop?: string
  label: string
  width?: string
  minWidth?: string
  slotName?: string
  fixed?: string
}

// 将属性合并到一起
export interface IForm {
  title?: string
  formItems: IFormItem[]
  labelWidth?: string
  colLayout?: any
  itemStyle?: any
}
export interface IContent {
  title?: string
  propList: IPropList[]
  showIndexColumn?: boolean
  showSelectColum?: boolean
}
