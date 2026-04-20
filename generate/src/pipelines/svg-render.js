import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates')
const PARTIALS_DIR = path.join(TEMPLATES_DIR, '_partials')

const compiledCache = new Map()
let partialsRegistered = false

function registerPartials() {
  if (partialsRegistered) return
  if (fs.existsSync(PARTIALS_DIR)) {
    for (const file of fs.readdirSync(PARTIALS_DIR)) {
      if (file.endsWith('.svg.hbs') || file.endsWith('.hbs')) {
        const name = file.replace(/\.(svg\.)?hbs$/, '')
        Handlebars.registerPartial(name, fs.readFileSync(path.join(PARTIALS_DIR, file), 'utf-8'))
      }
    }
  }
  registerHelpers()
  partialsRegistered = true
}

function registerHelpers() {
  Handlebars.registerHelper('eq', (a, b) => a === b)
  Handlebars.registerHelper('gte', (a, b) => Number(a) >= Number(b))
  Handlebars.registerHelper('add', (a, b) => Number(a) + Number(b))
  Handlebars.registerHelper('sub', (a, b) => Number(a) - Number(b))
  Handlebars.registerHelper('mul', (a, b) => Number(a) * Number(b))
  Handlebars.registerHelper('div', (a, b) => Number(a) / Number(b))
  Handlebars.registerHelper('json', (v) => JSON.stringify(v))
  // SVG では XML エスケープが必要 — Handlebars は HTML エスケープ既定で OK
}

export function renderSvg(templateName, context) {
  registerPartials()
  let compiled = compiledCache.get(templateName)
  if (!compiled) {
    const tplPath = path.join(TEMPLATES_DIR, templateName)
    if (!fs.existsSync(tplPath)) {
      throw new Error(`Template not found: ${templateName}`)
    }
    compiled = Handlebars.compile(fs.readFileSync(tplPath, 'utf-8'))
    compiledCache.set(templateName, compiled)
  }
  return compiled(context)
}
