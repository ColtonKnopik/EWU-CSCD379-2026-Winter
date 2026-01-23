<template>
  <aside class="leaderboard">
    <h3>Leaderboard</h3>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="players.length === 0" class="empty">No players yet</div>
    <div v-else class="leaderboard-entries">
      <div v-for="(player, index) in players" :key="player.username" class="player-entry">
        <span class="rank">{{ index + 1 }}.</span>
        <div class="player-info">
          <strong>{{ player.username }}</strong>
          <div class="stats">
            <span title="Games Played">GP: {{ player.games_played }}</span>
            <span title="Win Percentage">W%: {{ player.win_percentage }}%</span>
            <span title="Average Guesses">Avg: {{ player.avg_guesses }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const players = ref([])
const loading = ref(true)

const fetchLeaderboard = async () => {
  try {
    const res = await fetch('/games/wordle/get_leaderboard')
    const data = await res.json()
    
    // Sort by win percentage (desc) then games played (desc)
    players.value = data.sort((a, b) => {
      if (b.win_percentage !== a.win_percentage) {
        return b.win_percentage - a.win_percentage
      }
      return b.games_played - a.games_played
    })
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLeaderboard()
})
</script>

<style scoped>
.leaderboard {
  position: fixed;
  left: 20px;
  top: 80px;
  width: 220px;
  max-height: 80vh;
  overflow-y: auto;
  background: #23202a;
  color: #b6b6b6;
  padding: 15px 20px;
  border-radius: 10px;
  font-family: sans-serif;
  z-index: 10;
}

.leaderboard h3 {
  color: #c777c3;
  margin-bottom: 10px;
  margin-top: 0;
}

.loading,
.empty {
  color: #b6b6b6;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
}

.leaderboard-entries {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-entry {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #444;
  padding-bottom: 8px;
  font-size: 13px;
}

.player-entry:last-child {
  border-bottom: none;
}

.rank {
  font-weight: bold;
  color: #c777c3;
  min-width: 25px;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-info strong {
  display: block;
  color: #ffffff;
  word-break: break-word;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 3px;
  font-size: 12px;
  color: #9a9a9a;
}

.stats span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .leaderboard {
    position: static;
    width: 100%;
    max-height: 200px;
    margin-bottom: 20px;
  }
}
</style>
