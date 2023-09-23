<script setup lang="ts">
import { ref } from 'vue'
import 'element-plus/dist/index.css'
import AutoWidthInput from './AutoWidthInput.vue'

const inputValue = ref('auto width input')
</script>

<template>
  <h1>{{ inputValue }}</h1>
  <auto-width-input size="large" v-model="inputValue" maxlength="32" class="auto-input"/>
</template>

<style scoped>
.auto-input {
  min-width: 100px;
}
</style>