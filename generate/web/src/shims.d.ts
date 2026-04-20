declare module '*.yaml' {
  const value: unknown
  export default value
}

declare module '*.md?raw' {
  const value: string
  export default value
}
