import { IScriptConfig } from '@zmi-cli/webpack'
import { formatScripts, formatStyles } from './htmlTools'

test('formatScripts string', () => {
  const option1: string[] = []
  const option2 = ['https://github.com/l-zoy/zmi']
  const option3 = [`console.log(1);`]
  const option4 = ['https://github.com/l-zoy/zmi', `alert(1);`]

  expect(formatScripts(option1)).toEqual([])
  expect(formatScripts(option2)).toEqual([
    {
      src: 'https://github.com/l-zoy/zmi'
    }
  ])
  expect(formatScripts(option3)).toEqual([
    {
      content: 'console.log(1);'
    }
  ])
  expect(formatScripts(option4)).toEqual([
    {
      src: 'https://github.com/l-zoy/zmi'
    },
    {
      content: 'alert(1);'
    }
  ])
})

test('formatScripts object', () => {
  const option2 = [
    {
      src: 'https://github.com/l-zoy/zmi',
      crossOrigin: 'anonymous'
    },
    'alert(1);',
    'https://github.com/l-zoy/zmi'
  ]

  expect(formatScripts(option2)).toEqual([
    {
      src: 'https://github.com/l-zoy/zmi',
      crossOrigin: 'anonymous'
    },
    {
      content: 'alert(1);'
    },
    {
      src: 'https://github.com/l-zoy/zmi'
    }
  ])
})

test('formatScripts other', () => {
  const option2 = [
    null,
    'console.log(1);',
    'https://github.com/l-zoy/zmi',
    '',
    undefined,
    {}
  ] as IScriptConfig

  expect(formatScripts(option2)).toEqual([
    {
      content: 'console.log(1);'
    },
    {
      src: 'https://github.com/l-zoy/zmi'
    }
  ])
})

test('formatStyles', () => {
  expect(formatStyles([])).toEqual([[], []])

  expect(formatStyles(['//index.min.css', `.a{color: red};`])).toEqual([
    [
      {
        charset: 'utf-8',
        rel: 'stylesheet',
        type: 'text/css',
        href: '//index.min.css'
      }
    ],
    [{ content: '.a{color: red};' }]
  ])

  expect(
    formatStyles([
      '//index.min.css',
      {
        content: `.a{color: red};`,
        type: 'text/css',
        title: 'test'
      }
    ])
  ).toEqual([
    [
      {
        charset: 'utf-8',
        rel: 'stylesheet',
        type: 'text/css',
        href: '//index.min.css'
      }
    ],
    [{ content: '.a{color: red};', type: 'text/css', title: 'test' }]
  ])
})
