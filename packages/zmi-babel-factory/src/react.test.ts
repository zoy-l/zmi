import { transform } from '@babel/core'
import { Ioptions } from './index'

export function transformWithPreset(code: string, opts: Ioptions) {
  const filename = opts.typescript ? 'file.ts' : 'file.js'
  return transform(code, {
    filename,
    presets: [[require.resolve('./react.ts'), opts]],
    babelrc: false
  })!.code
}

test('babel-plugin-transform-react-remove-prop-types', () => {
  const code = transformWithPreset(
    `
import React, { PropTypes } from 'react';
function Message() {
  return <a />;
}
Message.propTypes = {
  a: PropTypes.bool.isRequired,
};
export default Message;
`,
    {
      // @ts-expect-error test
      react: true,
      env: {
        targets: { ie: 10 },
        modules: 'commonjs'
      },
      reactRemovePropTypes: true
    }
  )
  expect(code).not.toContain('Message.propTypes = {')
})
