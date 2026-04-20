import readmeRaw from '@root/README.md?raw'
import { marked } from 'marked'

function stripHeader(md: string): string {
  const divMatch = md.match(/<div align="center">[\s\S]*?<\/div>\s*/)
  if (divMatch && divMatch.index === 0) {
    md = md.slice(divMatch[0].length)
  }
  md = md.replace(/^\s*---\s*\n/, '')
  return md.trim()
}

const html = marked.parse(stripHeader(readmeRaw), { async: false }) as string

export function useReadmeHtml(): string {
  return html
}
