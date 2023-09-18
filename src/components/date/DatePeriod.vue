<template>
  <div class="date" :class="{ customize: route.path !== '/treeGroup' }">
    <slot name="first"></slot>
    <div class="datePicker" v-if="route.path !== '/treeGroup'">
      <DatePicker :date="date" @updateDate="updateDate" :types="types"/>
    </div>
    <div class="content">
      <el-select @change="ToggleDate(value)" v-model="value" class="datePicker" :placeholder="$t('請選擇日期')">
        <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" />
      </el-select>
      <slot name="search"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, onMounted } from 'vue-demi'
import { useRoute } from 'vue-router'
import DatePicker from '@/components/date/DatePicker.vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment-timezone'

const { t } = useI18n()

const props = defineProps({
  newDate: Number,
  types: {
    type: String,
    default: 'datetimerange'
  }
})

const route = useRoute()

const value = ref('')

const { newDate } = toRefs(props)
// watch(newDate, () => {
//   if (newDate.value) {
//     value.value = newDate.value
//     ToggleDate(newDate.value)
//   }
// })
const setDate = () => {
  if (newDate.value || newDate.value === 0) {
    value.value = newDate.value
    ToggleDate(newDate.value)
  }
}

watch(newDate, () => setDate())
onMounted(() => setDate())

const interval = ref([
  {
    text: '本週',
    num: 0
  },
  {
    text: '上一週',
    num: 1
  },
  {
    text: '上二週',
    num: 2
  },
  {
    text: '上三週',
    num: 3
  },
  {
    text: '上四週',
    num: 4
  },
  {
    text: '上五週',
    num: 5
  },
  {
    text: '上六週',
    num: 6
  },
  {
    text: '上七週',
    num: 7
  },
  {
    text: '上八週',
    num: 8
  },
  {
    text: '本月',
    num: 30
  },
  {
    text: '上月',
    num: 60
  }
])

// 修改全域時間至指定時區
const getStartDate = (period, type, time, day) => {
  return moment().tz('Brazil/East').subtract(period, type).startOf(type).hour(time).add(day, 'day').format('YYYY-MM-DD HH:mm:ss')
}

const getEndDate = (period, type, time, day) => {
  return moment().tz('Brazil/East').subtract(period, type).endOf(type).hour(time).add(day, 'day').format('YYYY-MM-DD HH:mm:ss')
}

const ToggleDate = (days, status) => {
  let dateFrom
  let dateTo
  value.value = days

  switch (days) {
    case 30:
      dateFrom = getStartDate(0, 'month', 0, 0)
      dateTo = getEndDate(0, 'month', 23, 0)
      break
    case 60:
      dateFrom = getStartDate(1, 'month', 0, 0)
      dateTo = getEndDate(1, 'month', 23, 0)
      break
    default:
      dateFrom = getStartDate(days, 'weeks', 0, 1)
      dateTo = getEndDate(days, 'weeks', 23, 1)
      break
  }

  if (status === 'init') return { dateFrom, dateTo }
  updateDate(dateFrom, dateTo)
}

const emit = defineEmits(['getDate'])
const date = ref([])
const updateDate = (dateFrom, dateTo, status) => {
  if (status) value.value = t('請選擇日期')
  date.value = [dateFrom, dateTo]
  // console.log(date.value[0])
  const time1 = new Date(dateFrom.replace(' ', 'T')).toISOString()
  const time2 = new Date(dateTo.replace(' ', 'T')).toISOString()
  emit('getDate', { dateFrom, dateTo, time1, time2 })
}

interval.value.forEach((item, index) => {
  if (item.text.length === 3) {
    const date = ToggleDate(item.num, 'init')
    interval.value[index].text = `${moment(date.dateFrom).format('MM-DD')} － ${moment(date.dateTo).format('MM-DD')}`
  }
})
</script>

<style lang="scss" scoped>
.date {
  display: flex;
  align-items: center;
  &.customize {
    @include breakpoint-up('sm') {
      flex-direction: column;
      align-items: initial;
    }
  }
  .datePicker {
    @include breakpoint-up('sm') {
      margin: 0 0 5px 0;
      order: 1;
    }
    .el-input__wrapper {
      width: 150px !important;
    }
  }
  .content {
    display: flex;
  }
}
</style>
