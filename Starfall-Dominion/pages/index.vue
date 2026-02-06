<template>
  <div>
    <StarfallMenu 
      v-if="!showMorePage && !showMapSelector"
      @online-play="navigateToOnlinePlay"
      @local-play="showMapSelectionDialog"  
      @map-editor="openMapEditor"
      @more="openMoreMenu"
    />
    <MorePage 
      v-else-if="showMorePage"
      @back="closeMorePage"
    />
    <MapSelector
      v-else-if="showMapSelector"
      @close="showMapSelector = false"
      @select="playWithCustomMap"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StarfallMenu from '~/components/StarfallMenu.vue'
import MorePage from '~/components/MorePage.vue'
import MapSelector from '~/components/MapSelector.vue'

const showMorePage = ref(false)
const showMapSelector = ref(false)

const navigateToOnlinePlay = (): void => {
    console.log('Navigating to online play...');
    navigateTo('/online');
};

const showMapSelectionDialog = (): void => {
    console.log('Opening map selection...');
    showMapSelector.value = true;
};

const playWithCustomMap = (mapId: number | null): void => {
    console.log('Playing with map:', mapId);
    if (mapId === null) {
      // Use local baseMap.json (no mapId parameter)
      navigateTo('/game');
    } else {
      // Use map from database
      navigateTo(`/game?mapId=${mapId}`);
    }
};

const openMapEditor = (): void => {
    console.log('Opening map editor...');
    navigateTo('/mapeditor');
};

const openMoreMenu = (): void => {
    console.log('Opening more menu...');
    showMorePage.value = true;
};

const closeMorePage = (): void => {
    showMorePage.value = false;
};
</script>

<style scoped>
/* Page-level styles if needed */
</style>