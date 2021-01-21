import kda from './home.vue'
import hello from './index.css'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'tsx',
  data() {
    return {
      tsx: 'hello vue tsx'
    }
  },

  components: {
    kda
  },

  setup() {
    const count = ref('hello setup')

    return {
      count
    }
  },

  render() {
    return (
      <div class={hello.red}>
        {this.tsx}
        <div> {this.count}</div>

        <kda class={hello.tsx} />
      </div>
    )
  }
})
