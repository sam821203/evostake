<template>
  <TreeGroup />
</template>

<script setup>
import TreeGroup from '@/views/treeGroup/TreeGroup.vue'
import useStore from '@/store/index'

const { treeStore } = useStore()
treeStore.$patch({
  targetTree: treeStore.groupData
})
</script>
