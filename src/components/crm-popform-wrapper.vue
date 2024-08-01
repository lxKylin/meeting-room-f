<template>
  <el-form
    action="javascript:void"
    label-width="120px"
    :class="useSearchPopover ? 'popform-wrapper' : 'form'"
  >
    <template v-for="searchConfig of searchConfigs" :key="searchConfig.prop">
      <el-form-item
        :prop="searchConfig.prop"
        :label="searchConfig.label"
        class="form-item"
      >
        <el-input
          v-if="searchConfig.type === 'input'"
          v-model.trim="searchForm[searchConfig.prop as string]"
          v-bind="searchConfig.controlProps"
          class="full-width"
          @keyup.enter="search"
        ></el-input>
        <el-select
          v-else-if="searchConfig.type === 'select'"
          v-model="searchForm[searchConfig.prop as string]"
          v-bind="searchConfig.controlProps"
          class="full-width"
          clearable
          filterable
          collapse-tags
        >
          <el-option
            v-for="option of searchConfig.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
        <el-select
          v-else-if="searchConfig.type === 'multiple-select'"
          v-model="searchForm[searchConfig.prop as string]"
          v-bind="searchConfig.controlProps"
          class="full-width"
          clearable
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="option of searchConfig.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
        <el-cascader
          v-else-if="searchConfig.type === 'cascader'"
          v-model="searchForm[searchConfig.prop as string]"
          class="full-width"
          :options="searchConfig.options"
          v-bind="searchConfig.controlProps"
          :props="searchConfig.controlProps?.multiple ? cascaderProps : {}"
          clearable
          collapse-tags
          size="default"
        />
        <a-range-picker
          v-else-if="searchConfig.type === 'daterange'"
          v-model:value="searchForm[searchConfig.prop as string]"
          v-bind="searchConfig.controlProps"
          value-format="x"
          class="full-width"
          :placeholder="['开始日期', '结束日期']"
          :locale="locale"
          :popup-style="{ zIndex: 4000 }"
        />
        <el-date-picker
          v-else-if="searchConfig.type === 'datetimerange'"
          v-model="searchForm[searchConfig.prop as string]"
          type="datetimerange"
          v-bind="searchConfig.controlProps"
          class="full-width"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :locale="locale"
          :popup-style="{ zIndex: 4000 }"
        />
      </el-form-item>
    </template>
  </el-form>
  <div class="bottom-button">
    <div>
      <slot name="order-button"></slot>
    </div>
    <div>
      <el-button v-if="useSearchPopover" @click="closePopover">取消</el-button>
      <el-button
        :type="useSearchPopover ? 'warning' : 'default'"
        @click="resetSearch"
      >
        重置
      </el-button>
      <el-button type="primary" @click="search">筛选</el-button>
      <slot name="export-button"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRef } from 'vue'
import { SearchConfig } from '@/types/table-column'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

const props = defineProps({
  searchConfigs: Array<SearchConfig>,
  searchForm: Object,
  useSearchPopover: Boolean
})
const searchForm = toRef(props, 'searchForm') as Record<string, any>
const emits = defineEmits(['search', 'resetSearch', 'closePopover'])

const cascaderProps = { multiple: true }

function search() {
  emits('search', searchForm)
}
function resetSearch() {
  emits('resetSearch')
}
function closePopover() {
  emits('closePopover')
}
</script>

<style lang="scss">
.popform-wrapper {
  display: flex;
  flex-direction: column;
  max-height: 300px;

  :deep(.el-form) {
    flex: auto;
    overflow-y: auto;
    padding: 10px;
  }

  .form-actions {
    flex: none;
    padding: 10px;
  }
}
.form {
  display: flex;
  flex-wrap: wrap;
}

.form-item {
  min-width: 310px;
}
.bottom-button {
  padding-right: 20px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
