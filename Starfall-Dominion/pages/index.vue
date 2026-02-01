<template>
  <div>
    <StarfallMenu 
      @online-play="navigateToOnlinePlay"
      @local-play="navigateToLocalPlay"  
      @map-editor="openMapEditor"
      @more="openMoreMenu"
    />
  </div>
</template>

<script setup lang="ts">
    // Import the component (adjust path based on your project structure)
    import StarfallMenu from '~/components/StarfallMenu.vue';

    // Using Nuxt's navigateTo composable
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
</script>

<style scoped>
/* Page-level styles if needed */
</style>