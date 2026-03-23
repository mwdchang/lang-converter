import { ref, onMounted, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';

interface TranslationEntry {
  german: string;
  english: string;
  timestamp: number;
}

const HISTORY_KEY = 'translation_history';

export function useHistory() {
  const history = ref<TranslationEntry[]>([]);

  // Load history from storage when the composable is mounted
  onMounted(async () => {
    await loadHistory();
  });

  const loadHistory = async () => {
    const { value } = await Preferences.get({ key: HISTORY_KEY });
    if (value) {
      history.value = JSON.parse(value);
    }
  };

  const saveHistory = async () => {
    await Preferences.set({
      key: HISTORY_KEY,
      value: JSON.stringify(history.value),
    });
  };

  const addEntry = (german: string, english: string) => {
    const newEntry: TranslationEntry = {
      german,
      english,
      timestamp: Date.now(),
    };
    history.value.unshift(newEntry); // Add to the beginning of the array
    saveHistory();
  };

  const deleteEntry = (index: number) => {
    history.value.splice(index, 1);
    saveHistory();
  };

  const clearAllHistory = () => {
    history.value = [];
    saveHistory();
  };

  return {
    history,
    addEntry,
    deleteEntry,
    clearAllHistory,
    loadHistory, // Expose for potential re-loading if needed
  };
}