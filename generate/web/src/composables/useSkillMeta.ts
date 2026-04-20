// illusions-skill.yaml をビルド時にロード（@rollup/plugin-yaml）

import meta from '@root/illusions-skill.yaml'

export interface SkillMeta {
  schema_version: string
  id: string
  name: string
  category?: string
  tags?: string[]
  license?: string
  author?: string
  repo?: string
  homepage?: string
  tier_1: {
    name_ja: string
    name_romaji: string
    tagline: string
    portrait: string
    key_kanji?: string
  }
  tier_2?: {
    description?: string
    badges?: string[]
    install_command?: string
  }
  tier_3?: {
    modes?: Array<{ icon: string; name: string; desc: string }>
    key_features?: string[]
  }
  tier_4?: Record<string, unknown>
  tier_5?: Record<string, unknown>
  design?: {
    accent_color?: string
    background?: string
    font_title?: string
    font_mono?: string
    font_body?: string
  }
}

export function useSkillMeta(): SkillMeta {
  return meta as SkillMeta
}

export function useOgImagePath(): string {
  return './og.png'
}

export function usePortraitPath(_meta: SkillMeta): string {
  // web/public/portrait.jpg (repo sources/portrait.jpg もしくは placeholder)
  return './portrait.jpg'
}
