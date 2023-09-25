<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElCol, ElSlider, vLoading } from 'element-plus'
import 'element-plus/dist/index.css'
import YoutubePlayer from './YoutubePlayer.vue'

const videoId = ref('qRqPWJlQtGI')
const duration = ref(0)
const form = reactive({
  videoId: 'qRqPWJlQtGI',
  state: 4,
  currentTime: 0
})
const stateMap = new Map()
stateMap.set(-1, 'unstarted')
stateMap.set(0, 'ended')
stateMap.set(1, 'playing')
stateMap.set(2, 'paused')
stateMap.set(3, 'buffering')
stateMap.set(4, 'loading')
stateMap.set(5, 'video cued')
const stateText = computed(() => stateMap.get(form.state))
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
</script>

<template>
  <el-col v-loading="form.state === 4">
    <youtube-player id="player" :video-id="videoId" v-model:state="form.state" v-model:duration="duration"
      v-model:currentTime="form.currentTime" />
    <el-form :model="form" label-width="100px" class="player-form">
      <el-form-item label="video id">
        <el-col :span="6">
          <el-input v-model="form.videoId" />
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="videoId = form.videoId">load video</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="state">
        <el-col :span="3">
          <el-button size="large" circle @click="form.state = form.state === 1 ? 2 : 1" :disabled="form.state === 3">
            <div :class="form.state === 1 ? 'pause' : 'play'"></div>
          </el-button>
        </el-col>
        <el-col :span="12">
          {{ stateText }}
        </el-col>
      </el-form-item>
      <el-form-item label="progress bar">
        <el-slider v-model="form.currentTime" :format-tooltip="formatTime" :max="duration" />
      </el-form-item>
    </el-form>
  </el-col>
</template>

<style scoped>
.player-form {
  margin-top: 20px;
  width: 640px;
}

.pause {
  position: relative;
  height: 15px;
  width: 10px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    height: 100%;
    width: 33%;
    background: #409eff;
  }

  &:before {
    left: 0;
  }

  &:after {
    right: 0;
  }
}

.play {
  margin-left: 4px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 12px solid #409eff;
}
</style>