<script setup lang="ts">
import { Repl, ReplStore } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'
import '@vue/repl/style.css'
import type MenuItem from '@/types/MenuItem'
declare const MENU_DATA: MenuItem[]

fetch('https://esm.run/element-plus@2.1.10').then(response => {
  response.text().then(text => {
    const matchResult = text.match(/\/vue@(.+?)\//)
    const vueVersion = matchResult![1]
    menusItems.forEach(menusItem => {
      menusItem.files['import-map.json'] = menusItem.files['import-map.json'].replaceAll('vueVersion', vueVersion)
    })
    store.setFiles(menusItems[0].files)
  })
})

const handleSelect = async (key: string) => {
  const keyNum = Number(key)
  if (activeMenuId === keyNum) {
    return
  }
  activeMenuId = keyNum
  store.setFiles(menusItems.find(menusItem => menusItem.id === keyNum)!.files)
}

const menusItems = MENU_DATA
let activeMenuId = menusItems[0].id
const store = new ReplStore()
</script>

<template>
  <el-container>
    <el-header class="page-header">
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
      <span>Live Vue Demo</span>
      <a href="https://elon-mao.github.io/react-demo/" target="_blank">React Demo</a>
      <a href="https://elon-mao.github.io/dictation/" target="_blank">Dictation</a>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="activeMenuId" class="el-menu-vertical-demo main-height" @select="handleSelect">
          <el-menu-item v-for="menuItem in menusItems" :index="menuItem.id">
            {{ menuItem.menuName }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main-height">
        <Repl :store="store" :editor="CodeMirror" :show-import-map="false" :show-ts-config="false"
          :show-compile-output="false" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.page-header {
  background-color: #1976d2;
  display: flex;
  align-items: center;
  padding: 30px;
}

.page-header>a,
.page-header>span {
  margin-left: 10px;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.6;
  letter-spacing: 0.0075em;
  color: white;
}

.page-header>span {
  flex-grow: 1;
}

.main-height {
  height: calc(100vh - 100px);
}
</style>

<style>
body {
  margin: 0;
}
</style>