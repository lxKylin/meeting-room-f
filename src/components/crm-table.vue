<template>
  <div v-loading="loading">
    <div
      v-if="searchConfigs.length > 0 || $slots['search-actions']"
      class="crm-table__search-wrapper mb10"
    >
      <template v-if="searchConfigs.length > 0">
        <el-popover
          v-if="useSearchPopover"
          :visible="searchFormVisible"
          placement="bottom-start"
          width="500px"
          popper-class="searchform-popper"
        >
          <template #reference>
            <el-button @click="searchFormVisible = !searchFormVisible">
              <el-icon class="mr5">
                <Filter />
              </el-icon>
              筛选
            </el-button>
          </template>
          <div class="popform-wrapper">
            <PopForm
              v-if="searchConfigs"
              :search-configs="searchConfigs"
              :search-form="searchForm"
              :use-search-popover="useSearchPopover"
              @search="search"
              @resetSearch="resetSearch"
              @closePopover="searchFormVisible = false"
            ></PopForm>
          </div>
        </el-popover>
        <div v-if="!useSearchPopover">
          <div class="popform-wrapper" style="max-height: 190px">
            <PopForm
              v-if="searchConfigs"
              :search-configs="searchConfigs"
              :search-form="searchForm"
              :use-search-popover="useSearchPopover"
              @search="search"
              @resetSearch="resetSearch"
            >
              <template #order-button>
                <slot name="order-button"></slot>
              </template>
              <template #export-button>
                <slot name="export-button"></slot>
              </template>
            </PopForm>
          </div>
        </div>
      </template>
      <template v-if="$slots['search-actions']">
        <slot name="search-actions"></slot>
      </template>
      <div
        v-if="searchTags.length > 0"
        class="crm-table__search-tags-wrapper mt10"
      >
        <span class="flex-none mr10">筛选条件</span>
        <div class="crm-table__search-tags flex-auto">
          <el-tag
            v-for="tag of searchTags"
            :key="tag.key"
            type="info"
            class="mr5 mb5"
            closable
            @close="removeSearchTag(tag.key)"
          >
            {{ tag.label }}
          </el-tag>
        </div>
        <span class="action-link flex-none" @click="resetSearch">重置</span>
      </div>
    </div>
    <div class="crm-table__wrapper">
      <el-popover
        :visible="visibleTableTitle"
        placement="bottom-start"
        :width="230"
      >
        <div class="popover-context">
          <el-checkbox-group
            v-model="showTitleList"
            :min="1"
            @change="handleCheckedCitiesChange"
          >
            <div
              style="display: flex; flex-direction: column; flex-wrap: nowrap"
            >
              <el-checkbox
                v-for="column in columns"
                :key="column.prop"
                :value="column.prop"
              >
                {{ column.label }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div style="text-align: right; padding-top: 4px">
          <el-button size="small" text @click="visibleTableTitle = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="confirmTableTitle">
            确认
          </el-button>
        </div>
        <template #reference>
          <el-icon class="table-setting-icon" @click="visibleTableTitle = true">
            <Setting />
          </el-icon>
        </template>
      </el-popover>
      <el-table
        :data="records"
        :header-cell-style="{
          background: '#fafafa',
          color: '#262626',
          height: '62px'
        }"
        :border="true"
        :default-sort="defaultSort"
        v-bind="$attrs"
        @sort-change="handleSortChange"
        @header-dragend="headerDragend"
      >
        <el-table-column
          v-if="showSelection"
          type="selection"
          width="50px"
        ></el-table-column>
        <template v-for="column of tableColumns" :key="column.prop">
          <el-table-column
            :prop="column.prop"
            :sortable="column.sortable ? 'custom' : false"
            :width="column.width || 'auto'"
            :min-width="column.minWidth || 'auto'"
            v-bind="column.columnProps || {}"
            height="200px"
          >
            <template #header>
              {{ column.label }}
              <el-tooltip
                v-if="column.headerTips"
                :content="column.headerTips"
                effect="dark"
                placement="bottom"
              >
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
            <template #default="{ row }">
              <template v-if="column.render">
                <template v-if="isVNode(column.render(row))">
                  <component :is="column.render(row)"></component>
                </template>
                <template v-else>{{ column.render(row) ?? '--' }}</template>
              </template>
              <template v-else>{{ getValueByPath(row, column.prop) }}</template>
            </template>
          </el-table-column>
        </template>
        <slot></slot>
      </el-table>
    </div>
    <el-affix
      ref="affixRef"
      position="bottom"
      :offset="0"
      :z-index="1000 - props.tableIndex"
    >
      <div v-if="!withoutPagination" class="pagination-wrapper">
        <div class="table-stat">
          <slot v-if="$slots['stat']" name="stat"></slot>
        </div>
        <el-pagination
          v-model:currentPage="page"
          v-model:page-size="limit"
          :pager-count="5"
          :page-sizes="[5, 10, 20, 50, 100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-affix>
  </div>
</template>
<script lang="ts" setup>
import ListParams from '@/types/list-params'
import TableColumn, { SearchConfig } from '@/types/table-column'
import { ElMessage } from 'element-plus'
import { ref, onMounted, computed, isVNode } from 'vue'
import { cloneDeep, sortBy as lodashSort } from 'lodash-es'
import { formatTime } from '@/utils/format-utils'
import PopForm from '@/components/crm-popform-wrapper.vue'
import { useRoute } from 'vue-router'
import { getHeaderWidth, saveHeaderWidth } from '@/utils/storage-utils'
const router = useRoute()

interface ResponseData {
  total: number
  records: Array<Record<string, any>>
}

interface Props {
  /**
   * 数据获取方法。该方法的返回值暂时仅支持Promise和简单对象
   * 返回简单对象时，对象的格式必须为{total: 0, records: []}
   * 返回Promise时，resolve的格式必须为{total: 0, records: []}
   */
  dataGetter: (params: ListParams) => ResponseData
  /**
   * 表格列定义
   */
  columns?: Array<TableColumn>
  /**
   *额外的筛选配置
   */
  searchConfigs?: Array<SearchConfig>
  /**
   * 是否使用弹出框筛选
   */
  useSearchPopover?: boolean
  /**
   * 是否挂载后立即获取数据
   */
  immediately?: boolean
  /**
   * 是否忽略分页
   */
  withoutPagination?: boolean
  /**
   * 默认排序
   */
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }

  /**
   * 是否显示复选框
   */
  showSelection?: boolean

  /**
   * 一个页面多个表格时需要说明表格顺序
   */
  tableIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  dataGetter: () => {
    return function () {
      return {
        total: 0,
        records: []
      }
    }
  },
  immediately: true,
  withoutPagination: false,
  useSearchPopover: true,
  tableIndex: 1
})

const SORT_DIRECT_MAP: any = {
  ascending: 'asc',
  descending: 'desc'
}

const visibleTableTitle = ref(false)
const showTitleList = ref()
const isIndeterminate = ref(true)
const tableColumns = ref<TableColumn[]>(props.columns || [])
const tableHeaderWidth = getHeaderWidth(router.path, props.tableIndex)

const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < props.columns!.length
}
const confirmTableTitle = () => {
  const columns = props.columns!.filter((column) => {
    return showTitleList.value.some((title: string) => title === column.prop)
  })
  tableColumns.value = columns
  resetHeaderWidth()
  visibleTableTitle.value = false
}
const resetHeaderWidth = () => {
  tableColumns.value.forEach((column) => {
    if (tableHeaderWidth[column.prop]) {
      column.width = `${tableHeaderWidth[column.prop]}px`
    }
  })
}
const page = ref(1)
const limit = ref(5)
const total = ref(0)
const sortBy = ref<string>(props.defaultSort?.prop || '')
const sortDirect = ref<string>(
  SORT_DIRECT_MAP[props.defaultSort?.order as string] || ''
)
const records = ref<Array<Record<string, any>>>([])
const loading = ref(false)
const searchForm = ref<any>({})
const searchFormVisible = ref<boolean>(false)
const searchTags = ref<any[]>([])
const affixRef = ref<any>()

const searchConfigs = computed<SearchConfig[]>(() => {
  const columns = props.columns || []
  let searchConfigs =
    columns
      .filter((column) => column.searchConfig)
      .map((column) => {
        if (!column.searchConfig!.prop) {
          column.searchConfig!.prop = column.prop
        }
        if (!column.searchConfig!.label) {
          column.searchConfig!.label = column.label
        }
        return column.searchConfig as SearchConfig
      }) || []
  searchConfigs = searchConfigs.concat(props.searchConfigs || [])
  searchConfigs.forEach((searchConfig) => {
    if (!searchConfig.order) {
      searchConfig.order = 0
    }
    if (!searchConfig.prop) {
      searchConfig.prop = '__prop_' + Math.random()
    }
    if (!searchConfig.controlProps) {
      searchConfig.controlProps = {}
    }
    if (!searchConfig.controlProps.placeholder) {
      const action = searchConfig.type === 'input' ? '输入' : '选择'
      searchConfig.controlProps.placeholder = `请${action}${searchConfig.label}`
    }
    searchForm.value[searchConfig.prop] =
      searchConfig.default || (searchConfig.type === 'daterange' ? [] : '')
  })
  return lodashSort(searchConfigs, 'order')
})

function updateAffix() {
  affixRef.value && affixRef.value.updateRoot()
}

onMounted(() => {
  resetHeaderWidth()
  showTitleList.value = props.columns?.map((column) => column.prop)
  if (props.immediately) {
    getTableData()
  }
})
function getTableData({ page: pageParam } = { page: 1 }) {
  // 只有加载第一页数据的时候，才会渲染筛选标签
  if (page.value === 1) {
    genSearchTags()
  }

  loading.value = true
  page.value = pageParam
  const result = props.dataGetter({
    sortBy: sortBy.value,
    sortDirect: sortDirect.value,
    page: page.value,
    limit: limit.value,
    ...searchForm.value
  })

  if (!(result instanceof Promise)) {
    total.value = result.total || 0
    records.value = result.records || []
    loading.value = false
    updateAffix()
  } else {
    result
      .then((res) => {
        if (props.withoutPagination) {
          records.value = res.data || []
          total.value = records.value.length
        } else {
          total.value = res.data?.total || 0
          records.value = res.data?.records || []
        }
      })
      .catch((err) => {
        records.value = []
        ElMessage.error(err.message || '获取数据异常')
      })
      .finally(() => {
        loading.value = false
        updateAffix()
      })
  }
}
function handleSizeChange(size: number) {
  limit.value = size
  getTableData({ page: 1 })
}
function handleCurrentChange(curPage: number) {
  getTableData({ page: curPage })
}
function reload() {
  getTableData({ page: 1 })
}
function reloadCurrentPage() {
  getTableData({ page: page.value })
}
function search(searchForm: any) {
  searchForm.values = searchForm
  searchFormVisible.value = false
  reload()
}
function resetSearch() {
  searchFormVisible.value = false
  searchConfigs.value.forEach((item) => {
    searchForm.value[item.prop as string] = ''
  })
  reload()
}
function handleSortChange({ prop, order }: any) {
  if (prop && order) {
    sortBy.value = prop
    sortDirect.value = SORT_DIRECT_MAP[order]
  } else {
    sortBy.value = ''
    sortDirect.value = ''
  }
  reload()
}
function genSearchTags() {
  const tags: any[] = []
  Object.keys(searchForm.value).forEach((key: any) => {
    let value = searchForm.value[key]
    const searchConfig = searchConfigs.value.find(
      (config) => config.prop === key
    )
    if (searchConfig && value !== null && value !== undefined) {
      const label = searchConfig.label || ''
      switch (searchConfig.type) {
        case 'daterange': {
          if (value instanceof Array && value.length === 2) {
            value = `${formatTime(+value[0])} ~ ${formatTime(+value[1])}`
          } else {
            value = ''
          }
          break
        }
        case 'datetimerange': {
          if (value instanceof Array && value.length === 2) {
            value = `${formatTime(
              +value[0],
              'YYYY-MM-DD HH:mm:ss'
            )} ~ ${formatTime(+value[1], 'YYYY-MM-DD HH:mm:ss')}`
          } else {
            value = ''
          }
          break
        }
        case 'select': {
          value = searchConfig.options?.find((item) => item.value === value)
            ?.label
          break
        }
        case 'multiple-select': {
          const valueArr: any[] = []
          searchConfig.options?.forEach((item) => {
            ;(value || []).forEach((iItem: any) => {
              if (item.value === iItem) {
                valueArr.push(item.label)
              }
            })
          })
          value = valueArr.join(',')
          break
        }
        case 'cascader': {
          const valueArr: any[] = []
          searchConfig.options?.forEach((item) => {
            ;(value || []).forEach((iItem: any) => {
              if (item.value === iItem[0]) {
                const productLineName = item.label
                const productName = item.children?.find(
                  (i: any) => i.value === iItem[1]
                )?.label
                valueArr.push(`${productLineName} / ${productName}`)
              }
            })
          })
          if (valueArr.length > 1) {
            value =
              valueArr.slice(0, 1).join(',') +
              `...等${valueArr.length}个筛选条件`
          } else {
            value = valueArr.join(',')
          }
          break
        }
        case 'person-select': {
          if (value instanceof Array) {
            value = value.map((item) => item.name).join(', ')
          } else {
            value = ''
          }
          break
        }
      }
      if (value && label) {
        tags.push({
          key,
          label: `${label}: ${value}`
        })
      }
    }
  })
  searchTags.value = tags
}
function removeSearchTag(key: string) {
  searchForm.value[key] = ''
  reload()
}

function getValueByPath(object: Record<string, any>, prop = '') {
  const paths = prop.split('.')
  let current = object
  let result = '--'
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i]
    if (!current) break

    if (i === j - 1) {
      result = current[path]
      break
    }
    current = current[path]
  }
  return result
}

function getSearchConditions() {
  return {
    ...cloneDeep(searchForm.value),
    sortBy: sortBy.value,
    sortDirect: sortDirect.value
  }
}

const headerDragend = (newWidth: number, _oldWidth: number, column: any) => {
  saveHeaderWidth(router.path, props.tableIndex, column.property, newWidth)
}

defineExpose({
  reload,
  reloadCurrentPage,
  getSearchConditions
})
</script>

<style lang="scss" scoped>
.crm-table__search-wrapper {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
}

.crm-table__wrapper {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px 5px 0 0;
  position: relative;
}
.el-affix {
  border-radius: 0 0 5px 5px;
  box-sizing: border-box;
  background-color: #fff;
}
.pagination-wrapper {
  padding: 10px;
  display: flex;
  width: 100%;
  background-color: #fff;
  justify-content: space-between;

  .table-stat {
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  :deep(.el-pager .number) {
    outline: none;
  }
}

.crm-table__search-tags-wrapper {
  display: flex;
  font-size: 14px;
  color: #666;
  align-items: flex-start;
}

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

.form-actions {
  text-align: right;
}

:global(.el-popover.el-popper.searchform-popper) {
  padding: 0;
}

.table-setting-icon {
  position: absolute;
  top: 11px;
  right: 11px;
  z-index: 999;
  width: 30px;
  height: 58px;
  background-color: #fafafa;
}

.popover-context {
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
