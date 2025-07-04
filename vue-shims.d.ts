// Type declaration for importing .vue files in TypeScript
// src/vue-shims.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}