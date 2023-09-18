<template>
  <div class="avatar">
    <p v-show="!images.avatar">{{ $t(title) }}</p>
    <img :src="images.avatar ? images.avatar : require('@/assets/add.png')" alt="" :class="{ add: !images.avatar }" />
    <input type="file" accept="image/jpeg,image/jpg,image/png" @change="changeImage($event, 'avatar')" class="uppic" v-if="props.inputStatus" />
    <!-- image/jpeg,image/jpg, -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue-demi'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

const props = defineProps({
  title: {
    default: 'true',
    type: String
  },
  getPIC: Object,
  inputStatus: {
    default: false,
    type: Boolean
  }
})

const getPICs = ref(props.getPIC)
const images = ref({ avatar: '', avatarFile: '' })
const emit = defineEmits(['update:returnPic'])
watch(
  getPICs,
  (PICdata) => {
    PICdata.then((result) => {
      if (!result.nodata) {
        const reader = new FileReader()
        // console.log(PICdata[0].size)
        // if (PICdata) {
        reader.readAsDataURL(result)
        reader.onload = () => {
          // console.log(reader.result)
          images.value.avatar = reader.result
          images.value.avatarFile = result
        }
      }
    }).catch((error) => {
      console.error(error) // 處理 Promise 被拒絕時的錯誤
    })

    // }
  },
  { immediate: true }
)
const changeImage = (e, type) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  if (file) {
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      emit('update:returnPic', images.value)
      images.value.avatar = e.target.result
      images.value.avatarFile = file
      // console.log(images.value[type])
      // console.log(images.value[`${type}File`])
    }
  }
}
// const resetimages = (formEl) => {
//   images.value.avatar = ''
//   images.value.avatarFile = ''
//   if (formEl) formEl.resetFields()
// }
</script>

<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 200px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  position: relative;
  p {
    position: absolute;
    color: black;
    font-weight: 600;
    font-size: 18px;
    top: 10px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    &.add {
      width: 50%;
      height: 50%;
    }
  }
  .uppic {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
