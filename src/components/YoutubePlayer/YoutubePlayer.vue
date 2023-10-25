<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
declare const window: {
  onYouTubeIframeAPIReady: () => void
}
declare const YT: any

const props = withDefaults(defineProps<{
  id: string
  videoId: string
  state?: number
  duration?: number
  currentTime?: number
}>(), {
  state: 4,
  duration: 0,
  currentTime: 0
})
const emit = defineEmits<{
  'update:state': [state: number]
  'update:duration': [duration: number]
  'update:currentTime': [currentTime: number]
}>()

onMounted(() => {
  const tag = document.createElement('script')
  tag.src = "https://www.youtube.com/iframe_api"
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag)
})
onUnmounted(() => clearInterval(playerTimeInterval))

let player: any
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player(props.id, {
    height: 360,
    width: 640,
    playerVars: {
      iv_load_policy: 3,
      modestbranding: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  })
}

const loadVideo = () => {
  emit('update:state', 4)
  emit('update:duration', 0)
  player.loadVideoById(props.videoId)
}

let playerTimeInterval: NodeJS.Timeout
let currentTime = 0
let seeking = false
const onPlayerReady = () => {
  loadVideo()
  playerTimeInterval = setInterval(() => {
    currentTime = player.getCurrentTime()
    if (!seeking) {
      emit('update:currentTime', Math.round(currentTime))
    }
  }, 100)
}
const onPlayerStateChange = (event: {
  data: number
}) => {
  if (props.duration == 0) {
    emit('update:duration', player.getDuration())
  }
  emit('update:state', event.data)
}

watch(
  () => props.videoId, loadVideo
)
watch(
  () => props.state,
  () => {
    switch (props.state) {
      case 1:
        player.playVideo()
        break
      case 2:
        player.pauseVideo()
        break
    }
  }
)
let seekTimeOut: NodeJS.Timeout
watch(
  () => props.currentTime,
  () => {
    if (Math.abs(props.currentTime - currentTime) > 1) {
      seeking = true
      player.seekTo(props.currentTime, true)
      clearTimeout(seekTimeOut)
      seekTimeOut = setTimeout(() => seeking = false, 1000)
    }
  }
)
</script>
<template>
  <div :id="id"></div>
</template>