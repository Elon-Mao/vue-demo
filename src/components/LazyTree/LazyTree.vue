<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type TreeNode from './TreeNode'

const props = withDefaults(defineProps<{
  path?: string[]
  loadNode: (nodeId: string) => Promise<TreeNode>
}>(), {
  path: () => []
})

const cacheNodes: Record<string, TreeNode> = {}
const loadByCache = async (nodeId: string) => {
  let node = cacheNodes[nodeId]
  if (node) {
    return node
  }
  node = await props.loadNode(nodeId)
  cacheNodes[nodeId] = node
  return node
}

const nodes = ref<TreeNode[]>([])
const rootUrl = /.*(?=#tree)|.*/.exec(window.location.href) + '#tree'
const onPathChange = async () => {
  nodes.value = []
  let newUrl = rootUrl
  for (const [index, nodeId] of props.path.entries()) {
    nodes.value.push(await loadByCache(nodeId))
    history.pushState({ treeDeep: index }, "", newUrl += '/' + nodeId)
  }
}

let stateCallBack = false
const popStateListener = () => {
  if (stateCallBack) {
    onPathChange()
    stateCallBack = false
  } else {
    props.path.pop()
    if (props.path.length === 0) {
      history.back()
    }
  }
}
watch(props.path, async () => {
  if (history.state && history.state.treeDeep !== undefined) {
    stateCallBack = true
    history.go(-1 - history.state.treeDeep)
  } else {
    onPathChange()
  }
}, { immediate: true })

const backByNode = (node: TreeNode) => {
  props.path.splice(props.path.indexOf(node.id) + 1)
}

addEventListener('popstate', popStateListener)
onUnmounted(() => {
  removeEventListener('popstate', popStateListener)
})
</script>

<template>
  <div class="tree-container">
    <div class="tree-header">
      <div v-for="(node, index) in nodes" :key="node.id">
        <div class="label-header" @click="backByNode(node)">
          {{ node.label }}
        </div>
        <div v-if="index !== nodes.length - 1" class="label-right-arrow"></div>
      </div>
    </div>
    <slot v-if="nodes.length" name="content" :node="nodes[nodes.length - 1]" />
  </div>
</template>

<style scoped>
@media screen and (max-width: 1023px) {
  .tree-container {
    font-size: 16px;
  }
}

@media screen and (min-width: 1024px) {
  .tree-container {
    font-size: 18px;
  }
}

.tree-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  --label-header-font-color: gray;
}

.tree-header {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  display: flex;
  overflow-x: auto;
}

.tree-header>* {
  flex-shrink: 0;
  height: 2em;
  display: flex;
  align-items: center;
}

.tree-header> :first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: white;
}

.tree-header> :last-child>.label-header {
  color: orange;
  background-color: lightgoldenrodyellow;
}

.label-header {
  padding: 0.1em 0.8em;
  border-radius: 1em;
  color: var(--label-header-font-color);
  background-color: lightgray;
  white-space: nowrap;
  cursor: pointer;
}

.label-right-arrow {
  margin: 0 0.5em;
  border-color: var(--label-header-font-color) var(--label-header-font-color) transparent transparent;
  border-style: solid;
  border-width: 1px;
  height: 0.5em;
  width: 0.5em;
  transform: rotate(45deg);
}
</style>
