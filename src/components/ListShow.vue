<template>
  <div>
    <h1>This is ListShow</h1>
    <pre>{{ items.length }}</pre>
  </div>
</template>

<script>
export default {
  props: ["items"],
  name: "ListShow",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
