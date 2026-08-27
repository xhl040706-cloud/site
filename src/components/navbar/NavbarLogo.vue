<template>
  <div class="navbar-logo cursor-pointer" @click="toHome">
    <img class="logo-img" src="@/assets/home/redesign/navbar-logo.svg" alt="CoStrict" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NavbarLogo',
})

const router = useRouter()

const toHome = () => {
  router.push({ name: 'home' })
}
</script>

<style lang="less" scoped>
.navbar-logo {
  display: flex;
  align-items: center;
  height: var(--space-16);

  .logo-img {
    display: block;
    width: 112px;
    height: 25px;
  }
}
</style>
