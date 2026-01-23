<template>
  <header class="toolbar">
    <h1 class="logo">WORDLE</h1>
    <div class="toolbar-right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #23202a;
  border-bottom: 1px solid #444;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  color: #c777c3;
}

.toolbar-right {
  display: flex;
  gap: 15px;
  align-items: center;
}
</style>
