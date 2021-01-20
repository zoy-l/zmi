<script lang="tsx">
import Home from './home.vue'
import hello from './index.css'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'hello world',
  data() {
    return {
      tsx: 'hello vue tsx'
    }
  },

  components: {
    Home
  },

  render() {
    return (
      <div class={hello.red}>
        {this.tsx}
        <Home />
      </div>
    )
  }
})
</script>

