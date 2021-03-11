import { recursiveReaddir } from '@zmi-cli/utils'
import rimraf from 'rimraf'
import path from 'path'

import appGenerator from './appGenerator'

const recursive = (path: string): Promise<{ error: Error; files: string[] }> =>
  new Promise((resolve) => {
    recursiveReaddir(path, (error, files) => {
      resolve({ error, files })
    })
  })

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000))
const rimrafAsync = (cwd: string) =>
  new Promise((rs, rj) => {
    rimraf(cwd, (error) => {
      if (error) {
        rj(error)
      } else {
        rs(null)
      }
    })
  })
jest.setTimeout(30000)

const fixtures = path.join(__dirname, '../fixtures')
const templates = path.join(__dirname, '../templates')

const replaceTpl = (file: string, cwd: string) => {
  if (path.extname(file) === '.tpl') {
    file = file.replace('.tpl', '')
  }
  return file.replace(cwd, '')
}

describe('app generator', () => {
  beforeEach(() => {
    window.console.log = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('input app name', async (done) => {
    const cwd = path.join(fixtures, 'test-react')
    const templateCwd = path.join(templates, 'react')

    await rimrafAsync(cwd)
    appGenerator(fixtures, { _: [], $0: '' })
    process.stdin.emit('keypress', 'test-react\r')
    await wait()
    process.stdin.emit('keypress', '\r')
    await wait()
    const fixturesFile = await recursive(cwd)
    const templateFile = await recursive(templateCwd)

    if (process.env.CI) {
      console.warn(JSON.stringify(fixturesFile))
    } else {
      expect(fixturesFile.files.length).toEqual(templateFile.files.length)
      // file order has changed
      // If two folders are the same, the number of folders is equal
      const arr = [
        ...new Set([
          ...fixturesFile.files.map((file) => file.replace(cwd, '')),
          ...templateFile.files.map((file) => replaceTpl(file, templateCwd))
        ])
      ]

      expect(templateFile.files.length).toEqual(arr.length)
    }

    done()
  })

  it('input app name repeat', async (done) => {
    const cwd = path.join(fixtures, 'test-react-ts')
    const templateCwd = path.join(templates, 'react-ts')

    await rimrafAsync(cwd)
    appGenerator(fixtures, { _: [], $0: '' })
    process.stdin.emit('keypress', 'test-react\r')
    await wait()
    process.stdin.emit('keypress', 'test-react-ts\r')
    await wait()
    process.stdin.emit('keypress', '', { name: 'down' })
    process.stdin.emit('keypress', '', { name: 'down' })
    process.stdin.emit('keypress', '', { name: 'up' })
    process.stdin.emit('keypress', '\r')
    await wait()

    const fixturesFile = await recursive(cwd)
    const templateFile = await recursive(templateCwd)

    if (process.env.CI) {
      console.warn(JSON.stringify(fixturesFile))
    } else {
      expect(fixturesFile.files.length).toEqual(templateFile.files.length)
      // file order has changed
      // If two folders are the same, the number of folders is equal
      const arr = [
        ...new Set([
          ...fixturesFile.files.map((file) => file.replace(cwd, '')),
          ...templateFile.files.map((file) => replaceTpl(file, templateCwd))
        ])
      ]

      expect(templateFile.files.length).toEqual(arr.length)
    }

    done()
  })

  it('input app name repeats', async (done) => {
    const cwd = path.join(fixtures, 'test-vue')
    const templateCwd = path.join(templates, 'vue')

    await rimrafAsync(cwd)
    appGenerator(fixtures, { _: [], $0: '' })
    process.stdin.emit('keypress', 'test-react\r')
    await wait()
    process.stdin.emit('keypress', 'test-react-ts\r')
    await wait()
    process.stdin.emit('keypress', 'test-vue\r')
    await wait()
    process.stdin.emit('keypress', '', { name: 'down' })
    process.stdin.emit('keypress', '', { name: 'down' })
    process.stdin.emit('keypress', '\r')
    await wait()

    const fixturesFile = await recursive(cwd)
    const templateFile = await recursive(templateCwd)

    if (process.env.CI) {
      console.warn(JSON.stringify(fixturesFile))
    } else {
      expect(fixturesFile.files.length).toEqual(templateFile.files.length)
      // file order has changed
      // If two folders are the same, the number of folders is equal
      const arr = [
        ...new Set([
          ...fixturesFile.files.map((file) => file.replace(cwd, '')),
          ...templateFile.files.map((file) => replaceTpl(file, templateCwd))
        ])
      ]

      expect(templateFile.files.length).toEqual(arr.length)
    }

    done()
  })

  it('cli app name miniapp', async (done) => {
    const cwd = path.join(fixtures, 'test-miniapp')
    const templateCwd = path.join(templates, 'miniapp')

    await rimrafAsync(cwd)
    appGenerator(fixtures, { _: ['test-miniapp'], $0: '' })
    await wait()
    process.stdin.emit('keypress', '', { name: 'up' })
    await wait()
    process.stdin.emit('keypress', '\r')
    await wait()

    const fixturesFile = await recursive(cwd)
    const templateFile = await recursive(templateCwd)

    if (process.env.CI) {
      console.warn(JSON.stringify(fixturesFile))
    } else {
      expect(fixturesFile.files.length).toEqual(templateFile.files.length)
      // file order has changed
      // If two folders are the same, the number of folders is equal
      const arr = [
        ...new Set([
          ...fixturesFile.files.map((file) => file.replace(cwd, '')),
          ...templateFile.files.map((file) => replaceTpl(file, templateCwd))
        ])
      ]

      expect(templateFile.files.length).toEqual(arr.length)
    }
    done()
  })

  it('cli app name', async (done) => {
    const cwd = path.join(fixtures, 'test-vue-ts')
    const templateCwd = path.join(templates, 'vue-ts')

    await rimrafAsync(cwd)
    appGenerator(fixtures, { _: ['test-vue-ts'], $0: '' })
    await wait()
    process.stdin.emit('keypress', '', { name: 'down' })
    process.stdin.emit('keypress', '', { name: 'down' })
    process.stdin.emit('keypress', '', { name: 'down' })
    await wait()
    process.stdin.emit('keypress', '\r')
    await wait()

    const fixturesFile = await recursive(cwd)
    const templateFile = await recursive(templateCwd)

    if (process.env.CI) {
      console.warn(JSON.stringify(fixturesFile))
    } else {
      expect(fixturesFile.files.length).toEqual(templateFile.files.length)
      // file order has changed
      // If two folders are the same, the number of folders is equal
      const arr = [
        ...new Set([
          ...fixturesFile.files.map((file) => file.replace(cwd, '')),
          ...templateFile.files.map((file) => replaceTpl(file, templateCwd))
        ])
      ]

      expect(templateFile.files.length).toEqual(arr.length)
    }
    done()
  })

  it('error', async (done) => {
    const cwd = path.join(fixtures, 'test-error')
    const templateCwd = path.join(templates, 'vue-ts')

    await rimrafAsync(cwd)
    appGenerator(fixtures, { _: ['test-error'], $0: '' })
    await wait()
    process.stdin.emit('keypress', '\r')
    await wait()

    const fixturesFile = await recursive(cwd)
    const templateFile = await recursive(templateCwd)

    if (process.env.CI) {
      //
    } else {
      // file order has changed
      // If two folders are the same, the number of folders is equal
      const arr = [
        ...new Set([
          ...fixturesFile.files.map((file) => file.replace(cwd, '')),
          ...templateFile.files.map((file) => replaceTpl(file, templateCwd))
        ])
      ]

      expect(templateFile.files.length).toEqual(13)
      expect(arr.length).toEqual(19)
    }

    done()
  })
})
