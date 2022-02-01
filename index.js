
const ANSI = {
  esc: 53,
  f1: 122,
  f2: 120,
  f3: 99,
  f4: 118,
  f5: 96,
  f6: 97,
  f7: 98,
  f8: 100,
  f9: 101,
  f10: 109,
  f11: 103,
  f12: 111,
  f13: 105,
  f14: 107,
  f15: 113,
  '`': 10,
  1: 18,
  2: 19,
  3: 20,
  4: 21,
  5: 23,
  6: 22,
  7: 26,
  8: 28,
  9: 25,
  0: 29,
  '-': 27,
  '=': 24,
  delete: 51,
  tab: 48,
  q: 12,
  w: 13,
  e: 14,
  r: 15,
  t: 17,
  y: 16,
  u: 32,
  i: 34,
  o: 31,
  p: 35,
  '[': 33,
  ']': 30,
  '|': 42,
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  g: 5,
  h: 4,
  j: 38,
  k: 40,
  l: 37,
  ';': 41,
  "'": 39,
  'return': 36,
  z: 6,
  x: 7,
  c: 8,
  v: 9,
  b: 11,
  n: 45,
  m: 46,
  ',': 43,
  '.': 47,
  '/': 44,
}

const STANDARDS = {
  ANSI
}

generate.ANSI = 'ANSI'
generate.JIS = 'JIS'
generate.ISO = 'ISO'

module.exports = generate

function generate({
  name,
  keyboards = []
}) {
  const xml = []
  xml.push(`<?xml version="1.1" encoding="UTF-8"?>`)
  xml.push(`<!DOCTYPE keyboard SYSTEM "file://localhost/System/Library/DTDs/KeyboardLayout.dtd">`)
  xml.push(`<keyboard group="126" id="0" name="${name}" maxout="2">`)
  xml.push(`  <layouts>`)
  xml.push(`    <layout first="0" last="17" mapSet="ANSI" modifiers="mod"/>`)
  xml.push(`    <layout first="18" last="18" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="21" last="23" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="30" last="30" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="33" last="33" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="36" last="36" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="194" last="194" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="197" last="197" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="200" last="201" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`    <layout first="206" last="207" mapSet="JIS" modifiers="mod"/>`)
  xml.push(`  </layouts>`)

  xml.push(`  <modifierMap id="mod" defaultIndex="0">`)
  keyboards.forEach(keyboard => {
    keyboard.configurations.forEach((config, i) => {
      const keys = []
      if (config.shift) {
        keys.push(`anyShift${config.shift === 'optional' ? '?' : ''}`)
      }
      if (config.option) {
        keys.push(`anyOption${config.option === 'optional' ? '?' : ''}`)
      }
      if (config.caps) {
        keys.push(`caps${config.caps === 'optional' ? '?' : ''}`)
      }
      if (config.control) {
        keys.push(`control${config.control === 'optional' ? '?' : ''}`)
      }
      xml.push(`    <keyMapSelect mapIndex="${i}">`)
      xml.push(`      <modifier keys="${keys.join(' ')}"/>`)
      xml.push(`    </keyMapSelect>`)
    })
  })

  xml.push(`  </modifierMap>`)

  const actions = []

  keyboards.forEach(keyboard => {
    xml.push(`  <keyMapSet id="${keyboard.standard}">`)
    keyboard.configurations.forEach((config, i) => {
      xml.push(`    <keyMap index="${i}">`)
      config.bindings.forEach(binding => {
        if (binding.sequence.length > 1) {
          const [start, ...shifts] = binding.sequence
          const code = STANDARDS[keyboard.standard][start]

          xml.push(`      <key code="${code}" action="${i}_${shifts[0]}"/>`)
          const action = []
          action.push(`    <action id="${i}_${shifts[0]}">`)
          action.push(`      <when state="none" next="${shifts[0]}" />`)
          while (shifts.length - 1) {
            action.push(`      <when state="${shifts[0]}" next="${shifts[1]}" />`)
            shifts.shift()
          }
          action.push(`      <when state="${shifts[0]}" output="${binding.result}" />`)
          action.push(`    </action>`)
          actions.push(...action)
        } else {
          const code = STANDARDS[keyboard.standard][binding.sequence[0]]
          xml.push(`      <key code="${code}" output="${binding.result}"/>`)
        }
      })
      xml.push(`    </keyMap>`)
    })
    xml.push(`  </keyMapSet>`)
  })

  if (actions.length) {
    xml.push(`  <actions>`)
    xml.push(...actions)
    xml.push(`  </actions>`)
  }

  xml.push(`</keyboard>`)

  return xml.join('\n')
}
