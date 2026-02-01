<template>
  <div>
    <StarfallMenu 
      v-if="!showMorePage"
      @online-play="navigateToOnlinePlay"
      @local-play="navigateToLocalPlay"  
      @map-editor="openMapEditor"
      @more="openMoreMenu"
    />
    <MorePage 
      v-else
      @back="closeMorePage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StarfallMenu from '~/components/StarfallMenu.vue'
import MorePage from '~/components/MorePage.vue'

const showMorePage = ref(false)

const navigateToOnlinePlay = (): void => {
    console.log('Navigating to online play...');
    navigateTo('/online');
};

const navigateToLocalPlay = (): void => {
    console.log('Navigating to local play...');
    navigateTo('/game');
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