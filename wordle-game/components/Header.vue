<template>
  <v-app-bar
    class="sp-header"
    :color="color"
    :elevation="0"
    border
    scroll-behavior="hide"
  >
    <template #prepend>
      <slot name="left" />
    </template>

    <v-app-bar-title class="sp-title">
      {{ title }}
    </v-app-bar-title>

    <v-spacer />

    <div class="sp-right">
      <!-- Your page-level actions still work -->
      <slot name="right" />

      <!-- Theme toggle -->
      <v-btn
        icon
        variant="text"
        aria-label="Toggle theme"
        @click="toggleTheme"
      >
        <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent'" />
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'

type ThemeName = 'light' | 'dark'

type Props = {
  title?: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  title: 'WORDLE',
  color: '#23202a',
})

const theme = useTheme()

// Persist theme choice (Nuxt cookie)
const themeCookie = useCookie<ThemeName>('theme', {
  default: () => 'light',
})

onMounted(() => {
  // Apply saved theme on first load
  theme.global.name.value = themeCookie.value
})

watch(
  () => theme.global.name.value,
  (val) => {
    // Keep cookie in sync
    if (val === 'light' || val === 'dark') themeCookie.value = val
  }
)

const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>

<style scoped>
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
