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
  gap: 6px;
  user-select: none;
  width: 100%;
  max-width: 500px;
  padding: 0 4px;
}

.kb-row {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: nowrap;
}

.kb-key {
  min-width: 0 !important; /* Override Vuetify defaults */
  flex: 1;
  max-width: 43px;
  height: 58px !important;
  font-weight: 700;
  text-transform: none;
  padding: 0 !important;
  font-size: 13px;
}

.kb-key--wide {
  flex: 1.5;
  max-width: 65px;
  font-size: 12px;
}

/* Tablet */
@media (max-width: 768px) {
  .kb {
    gap: 5px;
  }
  
  .kb-row {
    gap: 5px;
  }
  
  .kb-key {
    max-width: 38px;
    height: 52px !important;
    font-size: 12px;
  }
  
  .kb-key--wide {
    max-width: 58px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .kb {
    gap: 4px;
    padding: 0 2px;
  }
  
  .kb-row {
    gap: 4px;
  }
  
  .kb-key {
    max-width: 32px;
    height: 48px !important;
    font-size: 11px;
  }
  
  .kb-key--wide {
    max-width: 50px;
    font-size: 10px;
  }
}

/* Extra small phones */
@media (max-width: 400px) {
  .kb {
    gap: 3px;
  }
  
  .kb-row {
    gap: 3px;
  }
  
  .kb-key {
    max-width: 28px;
    height: 44px !important;
    font-size: 10px;
  }
  
  .kb-key--wide {
    max-width: 44px;
    font-size: 9px;
  }
}

/* Very small screens */
@media (max-width: 360px) {
  .kb-key {
    max-width: 26px;
    height: 40px !important;
  }
  
  .kb-key--wide {
    max-width: 40px;
  }
}
</style>