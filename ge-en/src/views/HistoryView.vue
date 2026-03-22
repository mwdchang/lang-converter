<template>
  <div class="history-container">
    <h1>Translation History</h1>
    <button @click="clearAllHistory" class="clear-all-button">Clear All History</button>

    <div v-if="history.length === 0" class="empty-history">
      <p>No translation history yet.</p>
    </div>

    <ul v-else class="history-list">
      <li v-for="(entry, index) in history" :key="index" class="history-item">
        <div class="translation-pair">
          <p class="original-text"><b>German:</b> {{ entry.german }}</p>
          <p class="translated-text"><b>English:</b> {{ entry.english }}</p>
        </div>
        <button @click="deleteEntry(index)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useHistory } from '@/composables/useHistory'; // Import useHistory

const { history, clearAllHistory, deleteEntry } = useHistory(); // Get history data and functions
</script>

<style scoped>
.history-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.clear-all-button {
  background-color: #dc3545;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.clear-all-button:hover {
  background-color: #c82333;
}

.empty-history {
  color: #666;
  font-style: italic;
  margin-top: 20px;
}

.history-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  align-items: end;
}

.translation-pair {
  flex-grow: 1;
  margin-right: 15px;
}

.original-text {
  font-style: italic;
  color: #399;
  margin-bottom: 5px;
}

.translated-text {
  color: #555;
}

.delete-button {
  background-color: #ffc107;
  color: #333;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #e0a800;
}
</style>
