<template>
  <Editor v-model="editorValue" :init="init"></Editor>
</template>

<script setup>
import { sendstatationMailPic } from '@/api/setting'
import { reactive, ref, watch, toRefs } from 'vue'

import tinymce from 'tinymce/tinymce.js'
// import 'tinymce/models/dom'; (TinyMCE 6)
// 外觀
import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/themes/silver'

// Icon
import 'tinymce/icons/default'

// 用到的外掛
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/emoticons/js/emojis.js'
import 'tinymce/plugins/table'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'

// 語言包
import 'tinymce-i18n/langs5/zh_TW.js'
// import 'tinymce-i18n/langs/zh_Hans.js' (TinyMCE 6 的簡體中文)

// TinyMCE-Vue
import Editor from '@tinymce/tinymce-vue'
console.log(tinymce)
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  plugins: {
    type: [String, Array],
    default: 'quickbars emoticons table link image media'
    // link image media
  },
  toolbar: {
    type: [String, Array],
    default:
      ' bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify|bullist numlist |outdent indent blockquote | undo redo | axupimgs | removeformat | table | emoticons | link unlink | image media'
    // | link unlink | image media table
  }
})

const emit = defineEmits(['update:modelValue'])

const init = reactive({
  language: localStorage.getItem('locale') === 'EN' ? 'en_US' : 'zh_TW',
  height: 500,
  menubar: false,
  content_css: false,
  skin: false,
  plugins: props.plugins,
  toolbar: props.toolbar,
  quickbars_insert_toolbar: false,
  image_uploadtab: true,
  images_upload_url: '/upload-image-endpoint',
  branding: false,
  // 修正色碼 focus 問題
  init_instance_callback: () => {
    const toxButton = document.querySelector('.tox-split-button__chevron')
    const toxTinymce = document.querySelector('.tox-tinymce')
    if (!toxButton) return

    toxButton.addEventListener('click', (e) => {
      setTimeout(() => {
        const toxSwatches = document.querySelector('.tox-swatches')
        toxSwatches.addEventListener('click', () => {
          toxTinymce.style.width = '10%'
          setTimeout(() => {
            toxTinymce.style.width = '100%'
          }, 10)
        })
      }, 0)
    })
  },
  images_upload_handler: async(blobInfo, success, failure) => {
    // 在這裡實現圖片上傳的邏輯，並呼叫 success 或 failure
    // const picdata = new FormData()
    // picdata.append('picture_id', data.data.pid)
    // picdata.append('picture', images.value.avatarFile)
    console.log(blobInfo.base64())
    console.log(blobInfo.blob())
    const anoucementPICdata = new FormData()
    // anoucementPICdata.append('picture_id', data.data.pid)
    // anoucementPICdata.append('picture', 'data:image/png;base64,' + blobInfo.base64())
    anoucementPICdata.append('picture', blobInfo.blob())
    const { data } = await sendstatationMailPic(anoucementPICdata)
    console.log(data.data.picture_id)
    const url = data.data.picture_id // 假設後端返回的圖片 URL 在 response.data.url 中
    success(`${process.env.VUE_APP_LINK}/picture/mail/` + url)
    // console.log(blobInfo.blob())
    // success('aa')
    // 在 images_upload_handler 函數中，實現將成功上傳的圖片插入到 Vue 的狀態 content 中。你可以使用 content.value += '<img src="' + imageUrl + '">'; 來將圖片插入到編輯器內容中。
  }
})

const { modelValue } = toRefs(props)
const editorValue = ref(modelValue.value)

watch(modelValue, (newValue) => {
  editorValue.value = newValue
})

watch(editorValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
