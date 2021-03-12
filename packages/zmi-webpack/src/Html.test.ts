import html from './Html'

import path from 'path'

test('getContent', async () => {
  const content = await html()
  expect(content).toContain('<!DOCTYPE html><html><head>')
})

test('getContent failed if tplPath not exists', async () => {
  try {
    await html({
      tplPath: path.join(__dirname, '../fixtures/not-found-tpl')
    })
  } catch (e) {
    expect(e.message).toMatch(/EISDIR: illegal operation on a directory, read/)
  }
})

test('getContent with config.mountElementId', async () => {
  const content = await html({
    config: {
      mountElementId: 'foo'
    },
    tplPath: path.join(__dirname, '../fixtures/not-found-tpl/custome-tpl.ejs')
  })
  expect(content).toContain(`<div id="foo"></div>`)
})

test('getContent with opts.metas', async () => {
  const content = await html({
    metas: [{ foo: 'bar' }]
  })
  expect(content).toContain('<meta foo="bar">')
})

test('getContent with scripts content', async () => {
  const content = await html({
    config: {
      publicPath: '/'
    },
    headScripts: [{ content: 'console.log(123);' }],
    scripts: [{ content: 'console.log(123);', nodeValue: 'hello' }]
  })

  expect(content.split('</head>')[0]).toContain('console.log(123);')
  expect(content.split('<body>')[1]).toContain(`<script nodevalue="hello">`)
})

test('getContent with scripts', async () => {
  const content = await html({
    config: {
      publicPath: '/'
    },
    headScripts: [{ content: 'console.log(123);' }],
    scripts: [{ src: '//github.com/a.js' }]
  })

  expect(content.split('</head>')[0]).toContain('console.log(123);')
  expect(content.split('<body>')[1]).toContain(`<script src="//github.com/a.js">`)
})

test('getContent with css', async () => {
  const content = await html({
    config: {
      publicPath: '/'
    },
    links: [{ rel: 'stylesheet', href: '//github.com/a.css' }],
    styles: [{ content: '.a{color: red;}', nodeValue: 'hello' }]
  })

  expect(content.split('</head>')[0]).toContain(
    '<link rel="stylesheet" href="//github.com/a.css"><style nodevalue="hello">'
  )
  expect(content.split('</head>')[0]).toContain('color: red;')
})

test('getContent modifyHTML css', async () => {
  const content = await html({
    config: {
      publicPath: '/'
    },
    modifyHTML: ($) => {
      $('body').append(`<div id="app"></div>`)
    }
  })

  expect(content.split('<body>')[1]).toContain('<div id="app"></div>')
})
