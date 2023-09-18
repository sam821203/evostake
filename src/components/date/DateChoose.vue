<template>
  <template v-if="isMobile || !button">
    <div class="date" v-if="choose">
      <el-select @change="ToggleDate(time)" v-model="time" :placeholder="$t('請選擇日期')">
        <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" />
      </el-select>
      <slot name="search"></slot>
      <slot name="create"></slot>
    </div>
    <DatePicker :date="date" @updateDate="updateDate" :types="types" />
  </template>
  <div class="dateGroup" v-else>
    <div class="date">
      <div class="datePicker">
        <DatePicker :date="date" @updateDate="updateDate" :types="types" :dateTitle="props.dateTitle" :disabled="disabled"/>
      </div>
      <slot name="search"></slot>
    </div>
    <div v-if="choose">
      <el-button type="primary" v-for="item in interval" :key="item.num" @click="ToggleDate(item.num)">{{ $t(item.text) }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted, toRefs } from 'vue-demi'
import DatePicker from '@/components/date/DatePicker.vue'
import moment from 'moment-timezone'
import { formatTimeZone } from '@/utils/useConvertTimeZone'
const props = defineProps({
  dateTitle: Boolean,
  newDate: Number,
  choose: {
    type: Boolean,
    default: true
  },
  button: {
    type: Boolean,
    default: true
  },
  types: {
    type: String,
    default: 'datetimerange'
    // datetime
    // datetimerange
    // daterange
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const time = ref('')

const { newDate } = toRefs(props)
const setDate = () => {
  if (newDate.value || newDate.value === 0) {
    time.value = newDate.value
    ToggleDate(newDate.value)
  }
}
watch(newDate, () => setDate())
onMounted(() => setDate())

const interval = ref([
  {
    text: '今日',
    num: 0
  },
  {
    text: '昨天',
    num: -1
  },
  {
    text: '本週',
    num: 7
  },
  {
    text: '上週',
    num: -7
  },
  {
    text: '本月',
    num: 30
  },
  {
    text: '上月',
    num: -30
  }
])

const { clientWidth } = inject('clientWidth')
const isMobile = computed(() => clientWidth.value === 'sm')

// 修改頁面時間至指定時區
const getStartDate = (period, type, time, day) => {
  return moment().tz('Brazil/East').subtract(period, type).startOf(type).hour(time).add(day, 'day').format('YYYY-MM-DD HH:mm:ss')
}

const getEndDate = (period, type, time, day) => {
  return moment().tz('Brazil/East').subtract(period, type).endOf(type).hour(time).add(day, 'day').format('YYYY-MM-DD HH:mm:ss')
}

const ToggleDate = (days) => {
  let dateFrom
  let dateTo
  time.value = days

  switch (days) {
    case 0:
      dateFrom = getStartDate(0, 'day', 0, 0)
      dateTo = getEndDate(0, 'day', 23, 0)
      break
    case -1:
      dateFrom = getStartDate(1, 'day', 0, 0)
      dateTo = getEndDate(1, 'day', 23, 0)
      break
    case -7:
      dateFrom = getStartDate(1, 'weeks', 0, 1)
      dateTo = getEndDate(1, 'weeks', 23, 1)
      break
    case 7:
      dateFrom = getStartDate(0, 'weeks', 0, 1)
      dateTo = getEndDate(0, 'weeks', 23, 1)
      break
    case -30:
      dateFrom = getStartDate(1, 'month', 0, 0)
      dateTo = getEndDate(1, 'month', 23, 0)
      break
    case 30:
      dateFrom = getStartDate(0, 'month', 0, 0)
      dateTo = getEndDate(0, 'month', 23, 0)
      break
  }
  updateDate(dateFrom, dateTo)
}

const emit = defineEmits(['getDate'])
const date = ref([])
const updateDate = (dateFrom, dateTo) => {
  let time1 = ''
  let time2 = ''

  if (dateFrom === '') {
    time1 = ''
    time2 = ''
  } else {
    date.value = [dateFrom, dateTo]

    time1 = new Date(dateFrom.replace(' ', 'T')).toISOString()
    time2 = new Date(dateTo.replace(' ', 'T')).toISOString()
  }
  emit('getDate', { dateFrom, dateTo, time1, time2 })
}

defineExpose({
  changeDate(dateFrom, dateTo) {
    updateDate(formatTimeZone(dateFrom, false), formatTimeZone(dateTo, false))
  },
  time
})
</script>

<style lang="scss" scoped>
.dateGroup {
  display: flex;
  flex-direction: column;
  @include breakpoint-up("sm") {
    flex-direction: row;
  }
}

.date {
  display: flex;
  .datePicker {
    margin: 0 0 10px 0;
  }
}
</style>
