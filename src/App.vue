<script setup lang="ts">
import { computed } from 'vue'
import { NMessageProvider } from 'naive-ui'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import { useRouterPrefetch } from '@/hooks/useRouterPrefetch'

// 启用路由悬停预加载
useRouterPrefetch()

const route = useRoute()
const showNavbar = computed(() => route.meta.hideNavbar !== true)
</script>

<template>
  <SiteHeader v-if="showNavbar" />
  <n-message-provider>
    <main>
      <router-view />
    </main>
  </n-message-provider>
</template>
