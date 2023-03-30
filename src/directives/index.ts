import { type App } from "vue"
import { permission } from "./permission"

/** 挂载自定义指令 */
export function loadDirectives(app: App) {
  app.directive("permission", permission)
}

import setupHighlightDirective from './highlight'

export function setupDirectives(app: App) {
  setupHighlightDirective(app)
}
