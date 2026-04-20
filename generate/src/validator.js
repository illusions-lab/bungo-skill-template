// illusions-skill.yaml の検証: JSON Schema + schema_version + 参照ファイル + フォント解決

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { SUPPORTED_SCHEMA_VERSIONS, DEFAULT_DESIGN } from './config.js'
import { loadSkillMeta } from './content-loader.js'
import { resolveFontPath, listAvailableFonts } from './font-resolver.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCHEMA_PATH = path.resolve(__dirname, '../schemas/illusions-skill.schema.json')

let cachedValidator
function getCompiledValidator() {
  if (!cachedValidator) {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'))
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)
    cachedValidator = ajv.compile(schema)
  }
  return cachedValidator
}

export class ValidationError extends Error {
  constructor(messages) {
    super('Validation failed:\n' + messages.map((m) => '  - ' + m).join('\n'))
    this.messages = messages
  }
}

export function validateSkill(yamlPath) {
  const errors = []
  const repoRoot = path.dirname(path.resolve(yamlPath))

  let meta
  try {
    meta = loadSkillMeta(yamlPath)
  } catch (e) {
    throw new ValidationError([`YAML parse error: ${e.message}`])
  }

  const validate = getCompiledValidator()
  if (!validate(meta)) {
    for (const e of validate.errors ?? []) {
      errors.push(`schema: ${e.instancePath || '/'} ${e.message}`)
    }
  }

  if (meta.schema_version && !SUPPORTED_SCHEMA_VERSIONS.includes(String(meta.schema_version))) {
    errors.push(
      `schema_version "${meta.schema_version}" not supported. Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`,
    )
  }

  const refsToCheck = [
    ['tier_1.portrait', meta.tier_1?.portrait],
    ['tier_4.philosophy_ref', meta.tier_4?.philosophy_ref],
    ['tier_4.sample_output_ref', meta.tier_4?.sample_output_ref],
    ['tier_5.full_layers_ref', meta.tier_5?.full_layers_ref],
    ['tier_5.citations_ref', meta.tier_5?.citations_ref],
  ]
  for (const [field, relPath] of refsToCheck) {
    if (relPath && !fs.existsSync(path.join(repoRoot, relPath))) {
      // portrait はプレースホルダーで補える、それ以外はコンテンツブロック skip
      const note = field === 'tier_1.portrait' ? 'will use placeholder' : 'content block will be skipped'
      console.warn(`[WARN] ${field}: ${relPath} not found, ${note}`)
    }
  }


  const fonts = [
    ['design.font_title', meta.design?.font_title ?? DEFAULT_DESIGN.font_title],
    ['design.font_mono', meta.design?.font_mono ?? DEFAULT_DESIGN.font_mono],
    ['design.font_body', meta.design?.font_body ?? DEFAULT_DESIGN.font_body],
  ]
  for (const [field, family] of fonts) {
    try {
      resolveFontPath(family)
    } catch (e) {
      errors.push(`${field}: ${e.message.split('\n')[0]}`)
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }

  return {
    meta,
    repoRoot,
    availableFonts: listAvailableFonts(),
  }
}
