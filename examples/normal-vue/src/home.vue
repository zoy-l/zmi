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
    return <div onClick={() => this.hello(123)}>123</div>
  }
})
</script>

<style lang="less" scoped>
.div {
  color: blue;
}
</style>
