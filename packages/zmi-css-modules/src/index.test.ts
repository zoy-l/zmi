import { transform } from '@babel/core'

function transformWithPlugin(code: string) {
  return transform(code, {
    filename: 'file.js',
    plugins: [require.resolve('./index.ts')]
  })!.code
}

test('css module', () => {
  expect(transformWithPlugin(`import styles from 'a.jss';`)).toEqual(`import styles from 'a.jss';`)

  expect(transformWithPlugin(`import styles from 'a.css';`)).toEqual(
    `import styles from "a.css?module";`
  )
  expect(transformWithPlugin(`import styles from 'a.less';`)).toEqual(
    `import styles from "a.less?module";`
  )
  expect(transformWithPlugin(`import styles from 'a.scss';`)).toEqual(
    `import styles from "a.scss?module";`
  )
  expect(transformWithPlugin(`import styles from 'a.sass';`)).toEqual(
    `import styles from "a.sass?module";`
  )
  expect(transformWithPlugin(`import styles from 'a.stylus';`)).toEqual(
    `import styles from "a.stylus?module";`
  )
  expect(transformWithPlugin(`import styles from 'a.styl';`)).toEqual(
    `import styles from "a.styl?module";`
  )
})
