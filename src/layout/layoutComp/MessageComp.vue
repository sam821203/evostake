<template>
  <div class="message">
    <el-dialog
      :model-value="hasCancel"
      :modal="hasBtn"
      :width="550"
      :show-close="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <template #header>
        <h2 :class="{ danger: titleDanger }">{{ title }}</h2>
      </template>
      <p v-if="typeof content === 'string'">{{ $t(content) }}</p>
      <p v-else v-for="item in content" :key="item" :style="{ color: item.color }">{{ $t(item.text) }}</p>
      <div v-if="rejectWithdraw" class="sp1">
        <p>{{ $t('拒絕原因將以站內信通知玩家，請輸入站內信內容') }}:</p>
        <table>
          <tr>
            <td>
              <p>{{ $t('標題') }}</p>
            </td>
            <td><input type="text" :placeholder="$t('請輸入站內信標題')" v-model="mailTitle" /></td>
          </tr>
          <tr>
            <td>
              <p>{{ $t('內文') }}</p>
            </td>
            <td>
              <textarea type="text" :placeholder="$t('請輸入站內信內文')" v-model="mailcontent"></textarea>
            </td>
          </tr>
        </table>
      </div>
      <div v-if="hasBtn" class="btn">
        <el-button v-if="type === 'info' || type === 'add'" type="primary" @click="msgStore.hasCancel = false">{{ $t('確認') }}</el-button>
        <template v-else>
          <el-button type="danger" @click="msgStore.hasCancel = false" :class="{ danger: type === 'review' || type === 'gCash' }">{{
            $t('取消')
          }}</el-button>
          <!-- :type="isInputContet ? `primary` : `warning`" -->
          <el-button v-if="rejectWithdraw" type="primary" @click="implement" :class="{ danger: type === 'formal' }">{{
            $t('確認')
          }}</el-button>

          <el-button v-else type="primary" @click="implement" :class="{ danger: type === 'formal' }">{{
            $t('確認')
          }}</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import useStore from '@/store/index'
import { storeToRefs } from 'pinia'
import { watch, ref } from 'vue-demi'

const { msgStore } = useStore()
const { changeRejecttitle, changeRejectcontent } = msgStore
const { title, titleDanger, content, hasCancel, type, hasBtn, rejectWithdraw } = storeToRefs(msgStore)
// , rejectTitle, rejectContent
const mailTitle = ref('')
const mailcontent = ref('')
//
const changeRejecttitles = (e) => {
  // console.log(e.target.value)
  // if (e) { return }
  changeRejecttitle(e)
}

const changeRejectcontents = (e) => {
  // e.target.value
  changeRejectcontent(e)
}
watch(mailTitle, (v) => {
  // console.log(v)
  changeRejecttitles(v)
  // changeRejectcontents
})
watch(mailcontent, (v) => {
  changeRejectcontents(v)
})
// const changeInputval = (k, event) => {
//   console.log(k)
//   k = event.target.value
//   // console.log(value) // 輸入的值
// }
// const isInputContet = computed(() => {
//   if (rejectTitle.value !== '' && rejectContent.value !== '') {
//     return true
//   } else {
//     return false
//   }
// })
const implement = () => {
  // console.log(rejectWithdraw)
  // console.log(rejectWithdraw.value)
  // console.log(rejectTitle.value)
  // , rejectTitle, rejectContent
  if (rejectWithdraw.value) {
    if (mailTitle.value === '' || mailcontent.value === '') {
      return
    }
  }
  msgStore.implement = true
  msgStore.hasCancel = false

  // rejectTitle
  // rejectContent
}

watch(hasCancel, (val) => {
  if (!val) {
    msgStore.$patch({
      title: ''
    })
  }
})

// 當沒有確定按鈕時，3秒後自動隱藏彈窗
watch(hasBtn, (val) => {
  if (!val) {
    setTimeout(() => {
      msgStore.$patch({
        hasCancel: false
      })
    }, 3000)
    setTimeout(() => {
      msgStore.$patch({
        hasBtn: true
      })
    }, 4000)
  }
})
</script>

<style lang="scss">
.message {
  .el-dialog {
    top: 40%;
    overflow-y: initial;
    @include breakpoint-up('sm') {
      clip-path: polygon(100% 0%, 100% 70%, 50% 90%, 50% 90%, 0 70%, 0 0);
      background: $light !important;
      top: 0;
      transform: translate(-50%, 0);
      width: 100%;
      .el-dialog__header h2 {
        text-align: center;
      }
      .el-dialog__body {
        p {
          display: flex;
          justify-content: center;
        }
        .btn {
          justify-content: center;
          padding: 15px 0 30px 0;
        }
      }
    }
    .el-dialog__body {
      padding: 0 20px 20px 20px !important;
      @include breakpoint-up('sm') {
        padding: 0 10px 10px 10px !important;
      }
      p {
        margin: 5px 0 15px 20px !important;
        font-weight: 600;
        font-size: 18px;
        &:first-child {
          margin-top: 0 !important;
        }
        @include breakpoint-up('sm') {
          margin: 0 !important;
        }
      }
      .sp1 {
        width: 100%;
        // background: red;
        table {
          p {
            margin-bottom: 0 !important;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          input {
            width: 400px;
          }
          textarea {
            width: 400px;
            height: 200px;
          }
        }
      }
    }
    h2 {
      border-bottom: 1px solid $info;
      &.danger {
        color: red;
      }
    }
    .btn {
      border-top: 1px solid $info;
      padding-top: 10px;
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
      @include breakpoint-up('sm') {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
