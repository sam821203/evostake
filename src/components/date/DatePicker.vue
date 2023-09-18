<template>
  <template v-if="isMobile">
    <div class="dateGroup">
      <el-date-picker v-model="date1" type="datetime" :placeholder="$t('起始時間')" @change="changeDate(date1, date2)" />
      <el-date-picker v-model="date2" type="datetime" :placeholder="$t('結束時間')" @change="changeDate(date1, date2)" />
    </div>
  </template>
  <template v-else>
    <el-form :label-width="dateTitle ? '100px' : 0" label-position="left">
      <el-form-item :label="dateTitle ? $t('時間區間') : ''">
        <!-- datetime
        datetimerange
        daterange -->
        <el-date-picker
          v-model="dateRange"
          :type="types"
          :start-placeholder="$t('起始時間')"
          :end-placeholder="$t('結束時間')"
          @visible-change="changeDate(dateRange == null ? '' : dateRange[0], dateRange == null ? '' : dateRange[1])"
          :size="isMobile ? 'default' : 'large'"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        />
      </el-form-item>
    </el-form>
  </template>
</template>

<script setup>
import { ref, watch, toRefs, inject, computed } from 'vue-demi'

const moment = require('moment')

const { clientWidth } = inject('clientWidth')
const isMobile = computed(() => clientWidth.value === 'sm')

const dateRange = ref('')
const date1 = ref('')
const date2 = ref('')

const props = defineProps({
  date: Array,
  dateTitle: Boolean,
  types: {
    type: String,
    default: 'datetimerange'
    // datetime
    // datetimerange
    // daterange
  }
})

const { date, dateTitle } = toRefs(props)
watch(date, () => {
  dateRange.value = date.value
  date1.value = date.value[0]
  date2.value = date.value[1]
})

const newDate = (val) => moment(val).format('YYYY-MM-DD HH:mm:ss')

const emit = defineEmits(['updateDate'])
const changeDate = (dateStart, dateEnd) => {
  if (dateStart === '' || dateEnd === '') {
    emit('updateDate', dateStart, dateEnd, true)
  } else {
    emit('updateDate', newDate(dateStart), newDate(dateEnd), true)
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  margin-left: 5px;
  .el-range-input {
    width: 100%;
  }
  @include breakpoint-up('sm') {
    width: 100%;
    margin-left: 0;
  }
}

:deep .el-form-item__label {
  font-size: 18px;
  font-weight: 900;
}

.el-form-item {
  margin-bottom: 0 !important;
}

.dateGroup {
  display: flex;
  @include breakpoint-up('sm') {
    width: calc(100vw - 25px);
  }
  .el-input {
    background: initial;
  }
}

:deep .el-range-input {
  width: 90%;
}
</style>
