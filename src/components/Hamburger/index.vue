<template>
  <div class="mainNavigation_blue"  @click="toggleClick">
    <span class="icon icon-gongzuotai hamburger" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger{
  font-size: 20px;
  color: #FFFFFF;
}
.mainNavigation_blue{
  background-color: #006EFF  ; width: 50px;text-align: center;padding-top: 2px;
}
</style>
