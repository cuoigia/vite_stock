<template>
  <button class="h-8 px-3 rounded-md shadow text-white bg-blue-500">Quét</button>
  <div>Home 2</div>
  <code>Name: {{ name }}</code>
</template>

<script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  export default {
    setup () {
      const store = useStore()
      // console.log('test env:==', process.env)
      console.log('test store', store)
      return {
        name: computed(() => store.state.user.name),
      }
    }
  }
</script>


<style lang="scss" scoped></style>