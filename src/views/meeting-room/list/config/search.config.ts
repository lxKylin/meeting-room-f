// 配置文件
import { IForm } from '@/base-ui/form'

export const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'name',
      type: 'input',
      label: '会议室名称',
      placeholder: '请输入会议室名称'
    },
    {
      field: 'count',
      type: 'input',
      label: '容纳人数',
      placeholder: '请输入容纳人数'
    },
    {
      field: 'position',
      type: 'select',
      label: '位置',
      placeholder: '请选择位置',
      options: [
        {
          label: '1号',
          value: '1'
        }
      ]
    },
    {
      field: 'equipment',
      type: 'select',
      label: '设备',
      placeholder: '请选择设备',
      options: [
        {
          label: '投影仪',
          value: '1'
        }
      ]
    }
  ]
}
