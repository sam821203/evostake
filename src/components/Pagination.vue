<template>
  <div class="pagination">
    <el-pagination
      background
      small
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalPage"
      :current-page="currentPage"
      :hide-on-single-page="true"
      @current-change="pagebtn"
    >
    </el-pagination>
  </div>
</template>

<script setup>
import { toRefs } from 'vue-demi'
const props = defineProps({
  totalPage: Number,
  currentPage: Number,
  pageSize: {
    type: Number,
    default: 100
  }
})
const { totalPage, currentPage, pageSize } = toRefs(props)

const emit = defineEmits(['changePage'])
const pagebtn = (currenctpage) => emit('changePage', currenctpage)
</script>

<style lang="scss">
.pagination {
  display: inline-block;
  .btn-prev,
  .btn-next {
    background: $dark !important;
    color: white !important;
    &:hover {
      background-color: $secondary !important;
    }
  }
  .el-pagination {
    .el-pager {
      li {
        background: $dark;
        color: white;
      }
      li:not(.is-disabled):hover {
        background-color: $secondary !important;
        color: #fff !important;
      }
      li:not(.is-disabled).is-active {
        background-color: $secondary !important;
        color: #fff !important;
      }
    }
  }
}
</style>
