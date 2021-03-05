import Html from './Html'

import path from 'path'

test('getContent', async () => {
  const html = new Html({
    config: {}
  })
  const content = await html.getContent({
    headScripts: [],
    metas: [],
    styles: [],
    scripts: [],
    links: []
  })

  expect(content).toContain('<!DOCTYPE html><html><head>')
})

test('getContent failed if tplPath not exists', async () => {
  const html = new Html({
    config: {}
  })
  try {
    await html.getContent({
      headScripts: [],
      metas: [],
      styles: [],
      scripts: [],
      links: [],
      tplPath: path.join(__dirname, '../fixtures/not-found-tpl')
    })
  } catch (e) {
    expect(e.message).toMatch(/getContent\(\) failed, tplPath of/)
  }
})

test('getContent with config.mountElementId', async () => {
  const html = new Html({
    config: {
      mountElementId: 'foo'
    }
  })
  const content = await html.getContent({
    headScripts: [],
    metas: [],
    styles: [],
    scripts: [],
    links: [],
    tplPath: path.join(__dirname, '../fixtures/not-found-tpl/custome-tpl.ejs')
  })
  expect(content).toContain(`<div id="foo"></div>`)
})

test('getContent with opts.metas', async () => {
  const html = new Html({
    config: {}
  })
  const content = await html.getContent({
    metas: [{ foo: 'bar' }],
    headScripts: [],
    styles: [],
    scripts: [],
    links: []
  })
  expect(content).toContain('<meta foo="bar">')
})

test('getContent with scripts content', async () => {
  const html = new Html({
    config: {
      publicPath: '/'
    }
  })
  const content = await html.getContent({
    styles: [],
    metas: [],
    links: [],
    headScripts: [{ content: 'console.log(123);' }],
    scripts: [{ content: 'console.log(123);', nodeValue: 'hello' }]
  })

  expect(content.split('</head>')[0]).toContain('console.log(123);')
  expect(content.split('<body>')[1]).toContain(`<script nodevalue="hello">`)
})

test('getContent with scripts', async () => {
  const html = new Html({
    config: {
      publicPath: '/'
    }
  })
  const content = await html.getContent({
    styles: [],
    metas: [],
    links: [],
    headScripts: [{ content: 'console.log(123);' }],
    scripts: [{ src: '//github.com/a.js' }]
  })

  expect(content.split('</head>')[0]).toContain('console.log(123);')
  expect(content.split('<body>')[1]).toContain(`<script src="//github.com/a.js">`)
})

test('getContent with css', async () => {
  const html = new Html({
    config: {
      publicPath: '/'
    }
  })
  const content = await html.getContent({
    metas: [],
    links: [{ rel: 'stylesheet', href: '//github.com/a.css' }],
    styles: [{ content: '.a{color: red;}', nodeValue: 'hello' }],
    headScripts: [],
    scripts: []
  })

  expect(content.split('</head>')[0]).toContain(
    '<link rel="stylesheet" href="//github.com/a.css"><style nodevalue="hello">'
  )
  expect(content.split('</head>')[0]).toContain('color: red;')
})

test('getContent modifyHTML css', async () => {
  const html = new Html({
    config: {
      publicPath: '/'
    }
  })
  const content = await html.getContent({
    metas: [],
    links: [],
    styles: [],
    headScripts: [],
    scripts: [],
    modifyHTML: ($) => {
      $('body').append(`<div id="app"></div>`)
    }
  })

  expect(content.split('<body>')[1]).toContain('<div id="app"></div>')
})

test('getAssets', () => {
  const html = new Html({
    config: {
      publicPath: '/foo/'
    }
  })
  expect(
    html.getAsset({
      file: 'a.css'
    })
  ).toEqual('/foo/a.css')
  expect(
    html.getAsset({
      file: '/b/bar.js'
    })
  ).toEqual('/foo/b/bar.js')
  expect(
    html.getAsset({
      file: 'https://a.com/b.jpg'
    })
  ).toEqual('https://a.com/b.jpg')
})
