<script setup lang="ts">
import { ref } from 'vue'
import 'element-plus/dist/index.css'
import SpeechToText from './SpeechToText.vue'

const text = ref('speak something')
</script>

<template>
  <h1>{{ text }}</h1>
  <SpeechToText v-model="text"></SpeechToText>
</template>