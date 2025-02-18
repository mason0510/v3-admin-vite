import type { App, Directive } from 'vue'
// @ts-ignore
import hljs from '@/directives/highlight.ts'
import { includeCode } from '@/utils/format'

// hljs.configure({ ignoreUnescapedHTML: true })

function highlightCode(el: HTMLElement) {
  if (includeCode(el.textContent))
    hljs.highlightBlock(el)
}

export default function setupHighlightDirective(app: App) {
  const highLightDirective: Directive<HTMLElement> = {
    mounted(el: HTMLElement) {
      highlightCode(el)
    },
    updated(el: HTMLElement) {
      highlightCode(el)
    },
  }

  app.directive('highlight', highLightDirective)
}
