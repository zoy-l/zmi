<template>
  <div @click="hello" class="div">
    {{ msg }}
  </div>
</template>

<script lang="ts">
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
  }
})
</script>

<style lang="less" scoped>
.div {
  color: blue;
}
</style>
