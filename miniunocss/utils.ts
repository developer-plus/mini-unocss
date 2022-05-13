
const vueFile = /.vue$/
export function filterVue(id: string) {
  return vueFile.test(id)
}