import { transform } from '@babel/core'
import { Ioptions } from './index'

export function transformWithPreset(code: string, opts: Ioptions) {
  const filename = opts.typescript ? 'file.ts' : 'file.js'
  return transform(code, {
    filename,
    presets: [[require.resolve('./vue.ts')]]
  })!.code
}

test('@vue/babel-plugin-jsx', () => {
  const code = transformWithPreset(
    `
    import kda from './home.vue'
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
      name: 'tsx',
      components: {
        kda
      },
      setup() {
        const count = ref('hello setup')

        return {
          count
        }
      },
      data() {
        return {
          tsx: 'hello vue tsx'
        }
      },
      render() {
        return (
          <div>1</div>
        )
      }
    })
`,
    {
      env: {
        targets: { ie: 10 }
      }
    }
  )

  expect(code).not
    .toContain(`  import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
  import kda from './home.vue';
  import { defineComponent, ref } from 'vue';
  export default defineComponent({
    name: 'tsx',
    components: {
      kda
    },

    setup() {
      const count = ref('hello setup');
      return {
        count
      };
    },

    data() {
      return {
        tsx: 'hello vue tsx'
      };
    },

    render() {
      return _createVNode("div", null, [_createTextVNode("1")]);
    }

  });`)
})
