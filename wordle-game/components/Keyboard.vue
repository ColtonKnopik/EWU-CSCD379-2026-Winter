<template>
  <div class="kb" @mousedown.prevent>
    <div class="kb-row">
        <v-btn
            v-for="k in row1"
            :key="k"
            class="kb-key"
            density="comfortable"
            variant="flat"
            :style="keyStyle(k)"
            :disabled="disabled"
            tabindex="-1"
            @click="press(k)"
        >
            {{ k }}
        </v-btn>

    </div>

    <div class="kb-row">
      <v-btn
            v-for="k in row2"
            :key="k"
            class="kb-key"
            density="comfortable"
            variant="flat"
            :style="keyStyle(k)"
            :disabled="disabled"
            tabindex="-1"
            @click="press(k)"
        >
            {{ k }}
        </v-btn>
    </div>

    <div class="kb-row">
      <v-btn
        class="kb-key kb-key--wide"
        density="comfortable"
        variant="flat"
        :style="specialKeyStyle"
        :disabled="disabled || enterDisabled"
        tabindex="-1"
        @click="press('ENTER')"
      >
        Enter
      </v-btn>

      <v-btn
            v-for="k in row3"
            :key="k"
            class="kb-key"
            density="comfortable"
            variant="flat"
            :style="keyStyle(k)"
            :disabled="disabled"
            tabindex="-1"
            @click="press(k)"
        >
            {{ k }}
        </v-btn>

      <v-btn
        class="kb-key kb-key--wide"
        density="comfortable"
        variant="flat"
        :style="specialKeyStyle"
        :disabled="disabled || backspaceDisabled"
        tabindex="-1"
        @click="press('BACKSPACE')"
      >
        ⌫
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
type KeyStatus = 'unused' | 'absent' | 'present' | 'correct'

const props = defineProps<{
  disabled?: boolean
  enterDisabled?: boolean
  backspaceDisabled?: boolean
  keyStatuses?: Record<string, KeyStatus> // expects uppercase letters
}>()

const emit = defineEmits<{
  (e: 'press', key: string): void
}>()

const row1 = ['Q','W','E','R','T','Y','U','I','O','P']
const row2 = ['A','S','D','F','G','H','J','K','L']
const row3 = ['Z','X','C','V','B','N','M']

function press(key: string) {
  emit('press', key)
}

function keyStyle(key: string) {
  const status = props.keyStatuses?.[key] ?? 'unused'

  // Match board CSS exactly
  switch (status) {
    case 'correct':
      return { backgroundColor: '#6aaa64', color: '#ffffff', border: '2px solid #6aaa64' }
    case 'present':
      return { backgroundColor: '#c9b458', color: '#ffffff', border: '2px solid #c9b458' }
    case 'absent':
      return { backgroundColor: '#787c7e', color: '#ffffff', border: '2px solid #787c7e' }
    default:
      return { backgroundColor: '#d3d6da', color: '#000000', border: '2px solid #d3d6da' }
  }
}

// Used for Enter / Backspace (default key look)
const specialKeyStyle = {
  backgroundColor: '#d3d6da',
  color: '#000000',
  border: '2px solid #d3d6da',
}

</script>

<style scoped>
.kb {
  display: grid;
  gap: 10px;
  user-select: none;
}

.kb-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: nowrap;
}

.kb-key {
  min-width: 38px;
  height: 48px;
  font-weight: 700;
  text-transform: none;
}


.kb-key--wide {
  min-width: 74px;
}
</style>
