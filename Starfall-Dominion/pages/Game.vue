<template>
  <Game :mapId="mapId" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Game from '~/components/Game/Game.vue'

const route = useRoute()

const mapId = computed(() => {
  const id = route.query.mapId
  return id ? Number(id) : undefined
})
</script>