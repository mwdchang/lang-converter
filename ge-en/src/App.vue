<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  router.push({ name: 'text' });
});
</script>

<template>
  <nav>
    <RouterLink to="/camera">Camera</RouterLink>
    <RouterLink to="/text">Text</RouterLink>
    <RouterLink to="/history">History</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
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
