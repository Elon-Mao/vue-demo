<script setup lang="ts">
import { computed, ref, onMounted, nextTick, type CSSProperties } from 'vue'
import { ElInput, type InputInstance } from 'element-plus'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const inputInstance = ref<InputInstance>()
const spanStyle = ref<CSSProperties>()
onMounted(() => {
  nextTick(() => {
    const anwserInput = inputInstance.value!.input!
    const inputStyle = getComputedStyle(anwserInput)
    const inputWrapperStyle = getComputedStyle(anwserInput.parentElement!)
    spanStyle.value = {
      padding: inputWrapperStyle.padding,
      lineHeight: inputWrapperStyle.height,
      fontSize: inputStyle.fontSize,
      fontWeight: inputStyle.fontWeight,
      fontFamily: inputStyle.fontFamily
    }
  })
})
</script>

<template>
  <div class="auto-width-wrapper">
    <span class="auto-width-span" :style="spanStyle">{{ value }}</span>
    <el-input ref="inputInstance" v-model="value" v-bind="$attrs" class="auto-width-input"></el-input>
  </div>
</template>

<style scoped>
.auto-width-wrapper {
  position: relative;
  display: inline-block;
}

.auto-width-span {
  visibility: hidden;
}

.auto-width-input {
  width: 100% !important;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
