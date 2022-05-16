import type { PluginOption, ViteDevServer } from 'vite'
import { createContext } from './context'
import { filterVue } from './utils'
import type { MiniunocssParams } from './types'

let server: ViteDevServer

function invalidateVirtualModule(server: ViteDevServer, id: string): void {
  if (!server)
    return
  const { moduleGraph, ws } = server
  const module = moduleGraph.getModuleById(id)
  if (module) {
    moduleGraph.invalidateModule(module)
    if (ws) {
      ws.send({
        type: 'full-reload',
        path: 'u.css',
      })
    }
  }
}

function update() {
  invalidateVirtualModule(server, 'u.css')
}

export function miniunocss({ presets }: MiniunocssParams) {
  const context = createContext(presets)
  return {
    name: 'miniunocss',
    enforce: 'pre',
    transform(code, id) {
      if (!filterVue(id))
        return
      context.code = code
      update()
      return null
    },
    resolveId(i) {
      return i === 'u.css' ? i : null
    },
    load(i) {
      if (i === 'u.css')
        return server ? context.parseCode(context.code) : context._waitAndParseCode()

      return null
    },
    configureServer(_server: ViteDevServer) {
      server = _server
    },
  } as PluginOption
}

