<template>
  <v-dialog v-model="isOpen" max-width="500" persistent>
    <v-card>
      <v-card-title 
        class="text-h5 text-center pa-4" 
        :class="won ? 'bg-green-lighten-4' : 'bg-red-lighten-4'"
      >
        {{ won ? 'You Won!' : 'Game Over' }}
      </v-card-title>

      <v-card-text class="pa-4">
        <div class="text-center mb-4">
          <div class="text-h6 mb-2">The word was:</div>
          <div class="text-h4 font-weight-bold text-primary">{{ word }}</div>
          <div v-if="won" class="text-body-2 text-grey mt-1">
            Solved in {{ guessCount }} {{ guessCount === 1 ? 'guess' : 'guesses' }}
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Definition Section -->
        <div v-if="loadingDefinition" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mt-2">Loading definition...</div>
        </div>

        <div v-else-if="definition">
          <div class="text-h6 mb-3">Definition:</div>
          
          <!-- Phonetic -->
          <div v-if="definition.phonetic" class="mb-3 text-grey-darken-1">
            <strong>Pronunciation:</strong> {{ definition.phonetic }}
          </div>

          <!-- Audio -->
          <div v-if="definition.audio" class="mb-3">
            <v-btn 
              size="small" 
              variant="outlined" 
              prepend-icon="mdi-volume-high"
              @click="playAudio"
            >
              Listen
            </v-btn>
          </div>

          <!-- Meanings -->
          <div v-for="(meaning, idx) in definition.meanings" :key="idx" class="mb-3">
            <div class="font-weight-bold text-primary mb-1">
              {{ meaning.partOfSpeech }}
            </div>
            <ol class="pl-4">
              <li v-for="(def, defIdx) in meaning.definitions.slice(0, 3)" :key="defIdx" class="mb-2">
                {{ def.definition }}
              </li>
            </ol>
          </div>
        </div>

        <div v-else-if="definitionError" class="text-center text-grey">
          <v-icon size="large" class="mb-2">mdi-information-outline</v-icon>
          <div>Could not load definition</div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn 
          color="primary" 
          variant="flat" 
          size="large"
          @click="handleClose"
        >
          Play Again
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  won: {
    type: Boolean,
    required: true
  },
  word: {
    type: String,
    required: true
  },
  guessCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = ref(props.modelValue)
const loadingDefinition = ref(false)
const definition = ref(null)
const definitionError = ref(false)
const audioElement = ref(null)

// Sync with v-model
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
  if (newVal && props.word) {
    fetchDefinition(props.word)
  }
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const fetchDefinition = async (word) => {
  loadingDefinition.value = true
  definitionError.value = false
  definition.value = null

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`)
    
    if (!response.ok) {
      throw new Error('Definition not found')
    }

    const data = await response.json()
    
    if (data && data.length > 0) {
      const entry = data[0]
      
      // Find audio URL
      let audioUrl = null
      if (entry.phonetics && entry.phonetics.length > 0) {
        for (const phonetic of entry.phonetics) {
          if (phonetic.audio) {
            audioUrl = phonetic.audio
            break
          }
        }
      }

      definition.value = {
        word: entry.word,
        phonetic: entry.phonetic || (entry.phonetics && entry.phonetics[0]?.text) || '',
        audio: audioUrl,
        meanings: entry.meanings || []
      }
    }
  } catch (error) {
    console.error('Failed to fetch definition:', error)
    definitionError.value = true
  } finally {
    loadingDefinition.value = false
  }
}

const playAudio = () => {
  if (definition.value?.audio) {
    if (audioElement.value) {
      audioElement.value.pause()
    }
    audioElement.value = new Audio(definition.value.audio)
    audioElement.value.play().catch(err => {
      console.error('Failed to play audio:', err)
    })
  }
}

const handleClose = () => {
  isOpen.value = false
  emit('close')
}
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>