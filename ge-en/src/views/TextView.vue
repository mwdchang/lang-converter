<template>
  <div class="text-translation-container">
    <h2>Text Translation</h2>
    <div class="input-section">
      <textarea
        v-model="inputText"
        placeholder="Enter German text here..."
        rows="6"
        :disabled="isModelLoading || isTranslating"
      ></textarea>
      <button @click="performTranslation" :disabled="isModelLoading || isTranslating || !inputText.trim()">
        {{ isModelLoading ? 'Loading Model...' : (isTranslating ? 'Translating...' : 'Translate') }}
      </button>
    </div>
    <div class="output-section">
      <h2>Translated Text:</h2>
      <p v-if="isModelLoading" class="placeholder-text">Model is loading, please wait...</p>
      <p v-else-if="translationError" class="error-text">Error: {{ translationError }}</p>
      <p v-else-if="isTranslating" class="placeholder-text">Translating...</p>
      <p v-else-if="translatedText">{{ translatedText }}</p>
      <p v-else class="placeholder-text">Translation will appear here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from '@/composables/useTranslation';
import { useHistory } from '@/composables/useHistory'; // Import useHistory

const inputText = ref('');
const translatedText = ref('');

const { translate, isModelLoading, translationError } = useTranslation();
const { addEntry } = useHistory(); // Get addEntry from useHistory
const isTranslating = ref(false); // Local state for UI while translation is in progress

const performTranslation = async () => {
  if (!inputText.value.trim() || isModelLoading.value || isTranslating.value) {
    return;
  }

  isTranslating.value = true;
  translatedText.value = ''; // Clear previous translation

  try {
    const result = await translate(inputText.value, 'de', 'en'); // Use simple lang codes
    translatedText.value = result;

    // Save to history only if translation was successful and not empty
    if (result && result.trim()) {
      addEntry(inputText.value, result);
    }
  } catch (error) {
    console.error('Failed to perform translation:', error);
    // translationError is already set by the composable,
    // but we can add more specific error handling here if needed.
  } finally {
    isTranslating.value = false;
  }
};
</script>

<style scoped>
.text-translation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.input-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.output-section {
  width: 100%;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 15px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.output-section h2 {
  color: #555;
  margin-top: 0;
  margin-bottom: 10px;
}

.output-section p {
  color: #666;
  font-size: 1.1rem;
  white-space: pre-wrap; /* Preserve whitespace and line breaks */
}

.placeholder-text {
  color: #999;
  font-style: italic;
}

.error-text {
  color: #dc3545;
  font-weight: bold;
}
</style>
