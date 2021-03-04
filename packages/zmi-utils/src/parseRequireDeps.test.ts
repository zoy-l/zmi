import { join } from 'path'
import slash from 'slash'

import parseRequireDeps from './parseRequireDeps'

const fixtures = join(__dirname, '../fixtures')

test('normal', () => {
  const fixture = join(fixtures, 'normal')

  const ret = parseRequireDeps(join(fixture, '.zmirc.ts')).map((p) =>
    p.replace(slash(fixture), '.')
  )
  expect(ret).toEqual(['./.zmirc.ts', './config/foo.ts', './src/a.js'])
})

test('directory index', () => {
  const fixture = join(fixtures, 'directory-index')
  const ret = parseRequireDeps(join(fixture, 'config/config.ts')).map((p) =>
    p.replace(slash(fixture), '.')
  )
  expect(ret).toEqual(['./config/config.ts', './utils/index.tsx', './src/foo.ts'])
})

test('avoid cycle', () => {
  const fixture = join(fixtures, 'cycle')
  const ret = parseRequireDeps(join(fixture, 'a.ts')).map((p) => p.replace(slash(fixture), '.'))
  expect(ret).toEqual(['./a.ts', './b.ts', './c.ts'])
})
