declare module '@/components/ui/*'
declare module '@/lib/utils'
declare module '@/page/*'

interface Window {
  __TANSTACK_QUERY_CLIENT__?: any
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}
