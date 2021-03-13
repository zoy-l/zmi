import kda from './home.vue'
import hello from './index.css'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Tsx',
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
      <div class={hello.red}>
        {this.tsx}
        <div> {this.count}</div>
        {/* {[1, 2].map((i) => {
          return <div>{i}</div>
        })} */}
        <kda class={hello.tsxHello} />
      </div>
    )
  }
})
