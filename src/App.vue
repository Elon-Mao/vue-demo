<script setup lang="ts">
import { Repl, ReplStore } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'
import '@vue/repl/style.css'
import type MenuItem from '@/types/MenuItem'
declare const MENU_DATA: MenuItem[]

const handleSelect = async (key: string) => {
  const keyNum = Number(key)
  if (activeMenuId === keyNum) {
    return
  }
  // completeLoading.value = false
  activeMenuId = keyNum
  store.setFiles(menusItems.find(menusItem => menusItem.id === keyNum)!.files)
}

// const completeLoading = ref(false)
const menusItems = MENU_DATA
let activeMenuId = MENU_DATA[0].id
const store = new ReplStore()
store.setFiles(MENU_DATA[0].files)
</script>

<template>
  <el-container>
    <el-header></el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="activeMenuId" class="el-menu-vertical-demo main-menu" @select="handleSelect">
          <el-menu-item v-for="menuItem in menusItems" :index="menuItem.id">
            {{ menuItem.menuName }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <Repl :store="store" :editor="CodeMirror" :show-import-map="false" :show-ts-config="false"
          :show-compile-output="false" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main-menu {
  min-height: calc(100vh - 100px);
}
</style>
