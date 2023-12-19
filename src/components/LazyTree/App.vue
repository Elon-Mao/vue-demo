<script setup lang="ts">
import { reactive, computed } from 'vue'
import LazyTree from './LazyTree.vue'

const path = reactive(['1', '1-2', '1-2-1', '1-2-1-1'])

// 模拟懒加载的数据
const loadNode = (nodeId: string) => {
  return Promise.resolve({
    id: nodeId,
    label: nodeId,
    children: nodeId.length > 10 ? undefined : [{
      id: nodeId + '-1',
      label: nodeId + '-1'
    }, {
      id: nodeId + '-2',
      label: nodeId + '-2'
    }, {
      id: nodeId + '-3',
      label: nodeId + '-3'
    }]
  })
}

const url = computed(() => path.join('/'))
const back = () => {
  if (path.length > 1) {
    history.back()
  }
}
</script>

<template>
  <h2> URL: {{ url }} </h2>
  <button class="back-button" @click="back">history.back()</button>
  <lazy-tree class="tree-size" :path="path" :loadNode="loadNode">
    <template #content="{ node }">
      <template v-if="node.children && node.children.length">
        <div v-for="childNode in node.children" class="child-node" @click="path.push(childNode.id)">
          {{ childNode.label }}
        </div>
      </template>
      <h3 v-else>
        没有内容
      </h3>
    </template>
  </lazy-tree>
</template>

<style scoped>
.back-button {
  margin: 10px;
}

.tree-size {
  width: 600px;
  height: 400px;
}

.child-node {
  margin: 1em 0;
  height: 3em;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1em;
  box-sizing: border-box;
  border: 1px solid lightgray;
  border-radius: 0.2em;
  box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.1);
}
</style>