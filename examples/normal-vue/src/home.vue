<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  data() {
    return {
      msg: 'hello vue 3'
    }
  },
  methods: {
    hello(num: number) {
      console.log(num)
    }
  },
  render() {
    return (
      <div class="helo" onClick={() => this.hello(123)}>
        123
      </div>
    )
  }
})
</script>

<style lang="less">
// @keyframes mymove {
//   from {
//     top: 0px;
//   }
//   to {
//     top: 200px;
//   }
// }
.helo {
  color: red;
  // animation: mymove 5s infinite;
}
</style>
