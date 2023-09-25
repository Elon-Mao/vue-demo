import type MenuItem from '@/types/MenuItem'

const stringifyJS = (value: any) => {
  return JSON.stringify(value, null, 2)
}

const defaultImportMap = {
  "vue": "https://esm.run/vue@3.3.4",
  "vue/server-renderer": "https://esm.run/vue@3.3.4/server-renderer"
}
const defaultTSconfig = {
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "jsx": "Preserve",
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true
  },
  "vueCompilerOptions": {
    "target": 3.3
  }
}

export default function generateMenu() {
  const menuItems: MenuItem[] = []
  const fs = require('fs')
  const path = require('path')
  console.log(__dirname)
  fs.readdirSync(__dirname).forEach((component: string) => {
    if (component === 'menu.ts') {
      return
    }
    const menuItemFiles = {
      'import-map.json': stringifyJS({
        imports: defaultImportMap
      }),
      'tsconfig.json': stringifyJS(defaultTSconfig),
    } as Record<string, string>
    const componentPath = path.join(__dirname, component)
    fs.readdirSync(componentPath).forEach((file: string) => {
      const filePath = path.join(componentPath, file)
      const fileData = fs.readFileSync(filePath, 'utf8').replaceAll('\r', '')
      if (file === 'info.json') {
        const jsonData = JSON.parse(fileData)
        jsonData.files = menuItemFiles
        if (jsonData.imports) {
          menuItemFiles['import-map.json'] = stringifyJS({
            imports: Object.assign(jsonData.imports, defaultImportMap)
          })
        }
        if (jsonData.tsconfig) {
          menuItemFiles['tsconfig.json'] = stringifyJS(jsonData.tsconfig)
        }
        menuItems.push(jsonData)
      } else {
        menuItemFiles['src/' + file] = fileData
      }
    })
  })
  return menuItems.sort((menuItem1, menuItem2) => menuItem1.id - menuItem2.id)
}