// Schema v1 → v2 migration template
// schema_version が "2" になったら、ここで v1 の YAML を v2 形式に変換する。
// 今は v1 のみサポートのため、スタブ実装。

export const FROM_VERSION = '1'
export const TO_VERSION = '2'

export function migrate(/* metaV1 */) {
  throw new Error(
    'No migrations needed yet. v1 is current. This file is a template for future versions.',
  )
}
