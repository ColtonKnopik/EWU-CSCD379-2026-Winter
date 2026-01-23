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
      <slot name="right" />

      <!-- Stats / leaderboard button -->
      <v-btn
        icon
        variant="text"
        aria-label="Open stats"
        @click="(e) => { statsOpen = true; blurTarget(e) }"
      >
        <v-icon icon="mdi-chart-box-outline" />
      </v-btn>

      <v-btn
        icon
        variant="text"
        aria-label="Toggle theme"
        @click="(e) => { toggleTheme(); blurTarget(e) }"
      >
        <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent'" />
      </v-btn>


    </div>
  </v-app-bar>

  <!-- Dialog lives alongside the app-bar -->
  <Leaderboard v-model="statsOpen" />
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useTheme } from 'vuetify'
import Leaderboard from '~/components/Leaderboard.vue'

type ThemeName = 'light' | 'dark'

type Props = {
  title?: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  title: 'WORDLE',
  color: 'surface',
})


const statsOpen = ref(false)

const theme = useTheme()
const themeCookie = useCookie<ThemeName>('theme', { default: () => 'light' })

onMounted(() => {
  theme.global.name.value = themeCookie.value
})

watch(
  () => theme.global.name.value,
  (val) => {
    if (val === 'light' || val === 'dark') themeCookie.value = val
  }
)

const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

const blurTarget = (e: Event) => {
  const el = e.currentTarget as HTMLElement | null
  el?.blur()
}

</script>

<style scoped>
.sp-header { color: #ffffff; }

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
