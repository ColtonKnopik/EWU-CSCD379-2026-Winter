<template>
  <v-dialog
    v-model="dialog"
    max-width="520"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <v-icon icon="mdi-trophy-outline" />
          <span>{{ title }}</span>
        </div>

        <v-btn icon variant="text" aria-label="Close" @click="dialog = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div v-if="loading" class="d-flex align-center ga-3">
          <v-progress-circular indeterminate size="22" />
          <span>Loading stats…</span>
        </div>

        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ error }}
          <div class="mt-3">
            <v-btn size="small" variant="outlined" @click="refreshStats">
              Retry
            </v-btn>
          </div>
        </v-alert>

        <div v-else>
          <v-row dense>
            <v-col cols="6">
              <StatTile label="Games" :value="stats.gamesPlayed" icon="mdi-gamepad-variant-outline" />
            </v-col>
            <v-col cols="6">
              <StatTile label="Win rate" :value="formatPercent(stats.winRate)" icon="mdi-percent" />
            </v-col>
            <v-col cols="6">
              <StatTile label="Wins" :value="stats.wins" icon="mdi-check-circle-outline" />
            </v-col>
            <v-col cols="6">
              <StatTile label="Losses" :value="stats.losses" icon="mdi-close-circle-outline" />
            </v-col>
            <v-col cols="6">
              <StatTile label="Current streak" :value="stats.currentStreak" icon="mdi-fire" />
            </v-col>
            <v-col cols="6">
              <StatTile label="Max streak" :value="stats.maxStreak" icon="mdi-trophy-award" />
            </v-col>
            <v-col cols="6">
              <StatTile label="Avg attempts" :value="formatAvgAttempts(stats.avgAttempts)" icon="mdi-counter" />
            </v-col>
          </v-row>

          <div class="mt-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2">Win rate</span>
              <span class="text-caption">{{ formatPercent(stats.winRate) }}</span>
            </div>

            <v-progress-linear
              :model-value="clamp01(stats.winRate) * 100"
              height="10"
              rounded
            />
          </div>

          <div v-if="stats.guessDistribution?.length" class="mt-6">
            <div class="text-subtitle-2 mb-2">Guess distribution</div>

            <div class="d-flex flex-column ga-2">
              <div
                v-for="(count, idx) in stats.guessDistribution"
                :key="idx"
                class="d-flex align-center ga-2"
              >
                <div class="text-caption" style="width: 18px;">
                  {{ idx + 1 }}
                </div>

                <v-progress-linear
                  :model-value="distributionPercent(count)"
                  height="10"
                  rounded
                />

                <div class="text-caption" style="width: 28px; text-align: right;">
                  {{ count }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="dialog = false">Close</v-btn>
        <v-btn variant="outlined" @click="refreshStats">Refresh</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePlayerStats } from '~/composables/usePlayerStats'

type Props = {
  modelValue: boolean
  title?: string
  refreshOnOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Player Stats',
  refreshOnOpen: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialog = computed<boolean>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const loading = ref(false)
const error = ref<string>('')

// local stats
const { stats: raw, load, reset, winRate, avgAttempts } = usePlayerStats()

const stats = computed(() => ({
  wins: raw.value.wins,
  losses: raw.value.losses,
  gamesPlayed: raw.value.gamesPlayed,
  winRate: winRate.value,
  currentStreak: raw.value.currentStreak,
  maxStreak: raw.value.maxStreak,
  guessDistribution: raw.value.guessDistribution,
  avgAttempts: avgAttempts.value,
}))

const refreshStats = () => {
  loading.value = true
  error.value = ''
  try {
    load()
  } catch {
    error.value = 'Could not load local stats.'
  } finally {
    loading.value = false
  }
}

watch(
  () => dialog.value,
  (open) => {
    if (open && props.refreshOnOpen) refreshStats()
  }
)

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}

function formatPercent(rate01: number): string {
  const pct = Math.round(clamp01(rate01) * 100)
  return `${pct}%`
}

function distributionPercent(count: number): number {
  const max = Math.max(...(stats.value.guessDistribution ?? [0]), 1)
  return (count / max) * 100
}

function formatAvgAttempts(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '—'
  return n.toFixed(2)
}
</script>

