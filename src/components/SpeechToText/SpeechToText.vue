<script setup lang="ts">
import { EnglishRecognizer } from './SpeechToText'
import { ref, computed } from 'vue'
import { ElInput, ElButton } from 'element-plus'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
const voiceInput = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const speeching = ref(false)
const loading = ref(false)

const onMouseUp = () => {
  removeEventListener('mouseup', onMouseUp)
  EnglishRecognizer.stopSpeech((results: string) => {
    voiceInput.value = results
    loading.value = false
  })
  speeching.value = false
}

const onMousedown = () => {
  speeching.value = true
  EnglishRecognizer.startSpeech()
  addEventListener('mouseup', onMouseUp)
}
const indices = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]
</script>

<template>
  <div class="speech-container">
    <div v-show="speeching" class="speeching-wrapper">
      <div v-for="i in indices" :style="{'--d': i}"></div>
    </div>
    <el-input v-model="voiceInput" v-loading="!speeching && loading" type="textarea" :autosize="{ minRows: 2 }" />
    <el-button type="primary" class="speech-button" @mousedown="onMousedown">hold to speak</el-button>
  </div>
</template>

<style scoped>
.speech-container {
  position: relative;
  width: 300px;
}
.speeching-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.speeching-wrapper div {
  background: #409eff;
  width: 6px;
  height: 20%;
  margin-right: 5px;
  animation: loading 1s infinite linear;
  animation-delay: calc(0.1s * var(--d));
}

@keyframes loading {
  0% {
    height: 20%;
  }

  50% {
    height: 50%;
  }

  100% {
    height: 20%;
  }
}

.speech-button {
  margin-top: 5px;
  width: 100%;
}
</style>
