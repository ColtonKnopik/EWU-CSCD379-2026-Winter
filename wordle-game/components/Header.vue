<template>
  <v-app-bar
    class="sp-header"
    :color="color"
    :elevation="0"
    border
    scroll-behavior="hide"
  >
    <!-- Optional left content -->
    <template #prepend>
      <slot name="left" />
    </template>

    <v-app-bar-title class="sp-title">
      {{ title }}
    </v-app-bar-title>

    <v-spacer />

    <!-- Right / actions -->
    <div class="sp-right">
      <slot name="right" />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
type Props = {
  title?: string
  
  color?: string
}

withDefaults(defineProps<Props>(), {
  title: 'WORDLE',
  color: '#23202a',
})
</script>

<style scoped>
/* Keep your branding without fighting Vuetify's layout */
.sp-header {
  color: #ffffff;
}

.sp-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #c777c3;
}

.sp-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
