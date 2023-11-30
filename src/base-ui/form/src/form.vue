<template>
  <div class="lx-form">
    <div class="lx-form__header">
      <slot name="header"></slot>
    </div>
    <div class="lx-form__main">
      <a-form :model="formData" auto-label-width>
        <a-row>
          <template v-for="item in formItems" :key="item.label">
            <a-col v-bind="colLayout">
              <a-form-item
                v-if="!item.isHidden"
                :label="item.label"
                :prop="item.field"
                :rules="item.rule"
                :style="itemStyle"
              >
                <template v-if="item.type === 'input'">
                  <a-input
                    v-bind="item.otherOptions"
                    v-model="formData[`${item.field}`]"
                    :placeholder="item.placeholder"
                    allow-clear
                  />
                </template>
                <template v-if="item.type === 'password'">
                  <a-input-password
                    v-bind="item.otherOptions"
                    v-model="formData[`${item.field}`]"
                    :placeholder="item.placeholder"
                    allow-clear
                  />
                </template>
                <template v-else-if="item.type === 'select'">
                  <a-select
                    v-model="formData[`${item.field}`]"
                    :placeholder="item.placeholder"
                    style="width: 100%"
                  >
                    <a-option
                      v-for="option in item.options"
                      :key="option.value"
                      :value="option.value"
                      :label="option.label"
                      v-bind="item.otherOptions"
                    >
                      {{ option.label }}
                    </a-option>
                  </a-select>
                </template>
                <template v-else-if="item.type === 'textarea'">
                  <a-textarea
                    v-model="formData[`${item.field}`]"
                    style="width: 100%"
                    :placeholder="item.placeholder"
                  ></a-textarea>
                </template>
                <template v-else-if="item.type === 'datepicker'">
                  <a-date-picker
                    v-bind="item.otherOptions"
                    v-model="formData[`${item.field}`]"
                    style="width: 100%"
                  ></a-date-picker>
                </template>
                <template v-else-if="item.type === 'time'">
                  <a-time-select
                    v-model="formData[`${item.field}`]"
                    start="08:30"
                    step="00:15"
                    end="18:30"
                    :placeholder="item.placeholder"
                  />
                </template>
                <template v-else-if="item.type === 'year'">
                  <a-date-picker
                    v-model="formData[`${item.field}`]"
                    type="year"
                    :placeholder="item.placeholder"
                  />
                </template>
                <template v-else-if="item.type === 'dates'">
                  <a-date-picker
                    v-model="formData[`${item.field}`]"
                    type="date"
                    :placeholder="item.placeholder"
                  />
                </template>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </div>
    <div class="lx-form__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, PropType, watch } from 'vue'

import { IFormItem } from '../types'

const props = defineProps({
  formItems: {
    // 为确保传入的数组是一个对象类型数组，把Array 当作 PropType，PropType接收一个泛型
    type: Array as PropType<IFormItem[]>,
    // 如果默认值是一个对象或者数组，需要写成一个函数
    default: () => []
  },
  rules: {
    type: Object,
    default: () => {}
  },
  itemStyle: {
    type: Object,
    default: () => ({})
  },
  // 设置响应式
  colLayout: {
    type: Object,
    default: () => ({
      xl: 6, // >= 1920px 显示4个(24/6)
      lg: 8, // >= 1200px 显示3个
      md: 12, // >= 992px 显示2个
      sm: 24, // >= 768px 显示1个
      xs: 24 // < 768px 显示1个
    })
  },
  // v-model传入的值叫modelValue
  modelValue: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['update:modelValue', 'validate', 'change'])

const formData: any = ref({ ...props.modelValue })
// 当formData发生改变时，就向外发送新数据newValue
watch(
  () => formData,
  (newValue) => {
    emits('update:modelValue', newValue)
  },
  {
    deep: true
  }
)
</script>

<style lang="less" scoped>
.lx-form {
  padding-top: 20px;
}
</style>
