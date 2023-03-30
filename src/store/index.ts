// import { createPinia } from "pinia"
//
// const store = createPinia()
//
// export default store

import type { App } from 'vue'
import { createPinia } from 'pinia'

export const store = createPinia()

//新写法
export function setupStore(app: App) {
    app.use(store)
}
//本来项目写法
export default store
// @ts-ignore
export * from './modules'
