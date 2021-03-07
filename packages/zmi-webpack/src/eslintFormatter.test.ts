// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { slash, stripAnsi } from '@zmi-cli/utils'
import eslintFormatter from './eslintFormatter'

test('eslint formatter null', () => {
  const stateNull = [
    {
      filePath: '/Users/zoy/zmi/packages/zmi-webpack/fixtures/react-config/src/index.jsx',
      messages: [],
      errorCount: 1,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      source:
        "import app from './app'\n\nconst foo = 1\n\n// @ts-ignore\n\nconst a = 1\nconsole.log(a, app)\n",
      usedDeprecatedRules: [
        { ruleId: 'lines-around-directive', replacedBy: ['padding-line-between-statements'] },
        { ruleId: 'no-buffer-constructor', replacedBy: [] },
        { ruleId: 'no-new-require', replacedBy: [] },
        { ruleId: 'no-path-concat', replacedBy: [] }
      ]
    }
  ]
  const data = eslintFormatter(stateNull)

  expect(data).toEqual('\n')
})

test('eslint formatter e', () => {
  const state = [
    {
      filePath: '/Users/zoy/zmi/packages/zmi-webpack/fixtures/react-config/src/index.jsx',
      messages: [
        {
          ruleId: '@typescript-eslint/ban-ts-comment',
          severity: 1,
          message: 'Do not use "@ts-ignore" because it alters compilation errors.',
          line: 5,
          column: 1,
          nodeType: 'Line',
          messageId: 'tsDirectiveComment',
          endLine: 5,
          endColumn: 14
        }
      ],
      errorCount: 1,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      source:
        "import app from './app'\n\nconst foo = 1\n\n// @ts-ignore\n\nconst a = 1\nconsole.log(a, app)\n",
      usedDeprecatedRules: [
        { ruleId: 'lines-around-directive', replacedBy: ['padding-line-between-statements'] },
        { ruleId: 'no-buffer-constructor', replacedBy: [] },
        { ruleId: 'no-new-require', replacedBy: [] },
        { ruleId: 'no-path-concat', replacedBy: [] }
      ]
    }
  ]
  const data = eslintFormatter(state)

  expect(slash(stripAnsi(data))).toContain(
    `fixtures/react-config/src/index.jsx\n  Line 5:1:  Do not use "@ts-ignore"`
  )
})

test('eslint formatter f', () => {
  const state = [
    {
      filePath: '/Users/zoy/zmi/packages/zmi-webpack/fixtures/react-config/src/index.jsx',
      messages: [
        {
          severity: 2,
          message: 'Do not use "@ts-ignore" because it alters compilation errors.',
          nodeType: 'Line',
          messageId: 'tsDirectiveComment',
          endLine: 5,
          endColumn: 14,
          fatal: true
        }
      ],
      errorCount: 1,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      source:
        "import app from './app'\n\nconst foo = 1\n\n// @ts-ignore\n\nconst a = 1\nconsole.log(a, app)\n",
      usedDeprecatedRules: [
        { ruleId: 'lines-around-directive', replacedBy: ['padding-line-between-statements'] },
        { ruleId: 'no-buffer-constructor', replacedBy: [] },
        { ruleId: 'no-new-require', replacedBy: [] },
        { ruleId: 'no-path-concat', replacedBy: [] }
      ]
    }
  ]
  const nodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  const data = eslintFormatter(state)
  process.env.NODE_ENV = nodeEnv

  expect(slash(stripAnsi(data))).toContain(`fixtures/react-config/src/index.jsx
  Line 0:  Do not use "@ts-ignore" because it alters compilation errors`)
})
