<template>
  <v-app class="bg-background">
    <v-layout>
      <Header />

      <v-main class="bg-background">
        <NuxtPage />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'
</script>
