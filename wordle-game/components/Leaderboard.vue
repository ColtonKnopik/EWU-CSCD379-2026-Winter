<template>
  <v-dialog v-model="dialog" max-width="520" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <!-- keep trophy icon -->
          <v-icon icon="mdi-trophy-outline" />
          <span class="dialog-title">{{ title }}</span>
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

        <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
          <div class="mt-3">
            <v-btn size="small" variant="outlined" @click="refreshStats">
              Retry
            </v-btn>
          </div>
        </v-alert>

        <div v-else>
          <!-- Wordle-style STATISTICS header + 4-up row -->
          

          <div class="stats-row">
            <div class="stat">
              <div class="stat-number text-high-emphasis">{{ stats.gamesPlayed }}</div>
              <div class="stat-label text-medium-emphasis">Played</div>
            </div>

            <div class="stat">
              <div class="stat-number text-high-emphasis">{{ formatPercent(stats.winRate) }}</div>
              <div class="stat-label text-medium-emphasis">Win %</div>
            </div>

            <div class="stat">
              <div class="stat-number text-high-emphasis">{{ stats.currentStreak }}</div>
              <div class="stat-label text-medium-emphasis">Current Streak</div>
            </div>

            <div class="stat">
              <div class="stat-number text-high-emphasis">{{ stats.maxStreak }}</div>
              <div class="stat-label text-medium-emphasis">Max Streak</div>
            </div>
          </div>
          
          <!-- Divider between top stats and extras -->
          <v-divider class="my-3" />

          <!-- Extras row (assignment-required visibility) -->
          <div class="extras-row">
            <div class="extra">
              <div class="extra-number text-high-emphasis">{{ stats.wins }}</div>
              <div class="extra-label text-medium-emphasis">Wins</div>
            </div>

            <div class="extra">
              <div class="extra-number text-high-emphasis">{{ stats.losses }}</div>
              <div class="extra-label text-medium-emphasis">Losses</div>
            </div>

            <div class="extra">
              <div class="extra-number text-high-emphasis">{{ formatAvgAttempts(stats.avgAttempts) }}</div>
              <div class="extra-label text-medium-emphasis">Avg Win Guesses</div>
            </div>
          </div>

          <div class="stats-divider" />

          <div class="dist-header">GUESS DISTRIBUTION</div>

          <div class="dist">
            <div
              v-for="(count, idx) in stats.guessDistribution"
              :key="idx"
              class="dist-row"
            >
              <div class="dist-label text-high-emphasis">{{ idx + 1 }}</div>

              <div class="dist-bar-wrap">
                <div
                  class="dist-bar"
                  :class="{ 'dist-bar-empty': count === 0 }"
                  :style="{ width: `${distributionPercent(count)}%` }"
                >
                  <!-- Hide zeros -->
                  <span class="dist-count" v-if="count > 0">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { usePlayerStats } from '~/composables/usePlayerStats'

type Props = {
  modelValue: boolean
  title?: string
  refreshOnOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  // Wordle-like title
  title: 'Statistics',
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
const error = ref('')

// local stats
const { stats: raw, load, winRate, avgAttempts } = usePlayerStats()

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

onMounted(() => {
  refreshStats()
})

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
  const dist = stats.value.guessDistribution ?? []
  const max = Math.max(...dist, 1)

  // Wordle shows no bar for 0
  if (count <= 0) return 0

  const pct = (count / max) * 100
  // Ensure small counts are still visible like Wordle
  return Math.max(6, pct)
}

function formatAvgAttempts(n: number): string {
  // Show "-" when not calculable yet (no wins)
  if (!Number.isFinite(n) || n <= 0) return '-'
  return n.toFixed(2)
}
</script>

<style scoped>
/* Wordle-ish title feel (while keeping your layout) */
.dialog-title {
  font-weight: 800;
  letter-spacing: 0.04em;
  font-size: 20px;
}

.stats-header {
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 18px;
  margin-bottom: 10px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  text-align: center;
  margin-bottom: 14px;
}

.stat-number {
  font-size: 34px;
  line-height: 1;
  font-weight: 700;
}

.extras-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  text-align: center;
  margin-bottom: 14px;
}

.extra-number {
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
}

.stats-divider {
  height: 1px;
  background: rgba(var(--v-theme-on-surface), 0.12);
  margin: 8px 0 14px;
}

.dist-header {
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 14px;
  margin-bottom: 10px;
}

.dist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dist-row {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: center;
}

.dist-bar-wrap {
  width: 100%;
}

/* Wordle bar */
.dist-bar {
  height: 18px;
  background: #787c7e; /* Wordle gray */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  min-width: 0;
}

/* When width is 0, prevent any weird padding/size artifacts */
.dist-bar-empty {
  padding-right: 0;
}

.dist-count {
  color: white;
  font-size: 12px;
  font-weight: 700;
}
</style>
