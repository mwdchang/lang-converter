<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <nav>
    <RouterLink to="/">Camera</RouterLink>
    <RouterLink to="/text">Text</RouterLink>
    <RouterLink to="/history">History</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
body {
}

nav {
  width: 100%;
  font-size: 1.0rem;
  text-align: center;
  margin-top: 1rem;
}

nav a {
  display: inline-block;
  background: #dddddd;
  padding: 0.25rem 1.25rem;
  text-decoration: none;
  border-radius: 0.25rem;
  margin: 0 0.25rem;
}

nav a:first-of-type {
  border: 0;
}

</style>
