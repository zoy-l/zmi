import Home from './home.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'hello world',
  data() {
    return {
      tsx: 'hello tsx'
    }
  },

  components: {
    Home
  },

  render() {
    return (
      <div>
        {this.tsx}
        <Home />
      </div>
    )
  }
})
