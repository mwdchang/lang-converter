import { ref, onMounted } from 'vue';
import { pipeline, env } from '@huggingface/transformers';

// Configure Transformers.js for offline use
// 1. Disable remote models so that the library doesn't try to download from the Hub.
env.allowRemoteModels = false;
// 2. Enable local models to be loaded from the local path.
env.allowLocalModels = true;
// 3. Set the path to the local models directory.
//    This path is relative to the `public` folder.
env.localModelPath = '/models/';

export function useTranslation() {
  const translator = ref<any>(null); // Stores the initialized pipeline
  const isModelLoading = ref(true); // Tracks if the model is still loading
  const translationError = ref<string | null>(null); // Stores any errors during model loading or translation

  onMounted(async () => {
    // --- DEBUGGING: Test if we can fetch a file from the public directory ---
    try {
      const testUrl = '/models/Xenova/nllb-200-distilled-600M/generation_config.json';
      console.log(`[DEBUG] Fetching: ${testUrl}`);
      const response = await fetch(testUrl);
      console.log('[DEBUG] Fetch response status:', response.status);
      if (!response.ok) {
        throw new Error(`[DEBUG] Failed to fetch test file. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('[DEBUG] Fetched data successfully:', data);
    } catch (e) {
      console.error('[DEBUG] Fetch test failed:', e);
    }
    // --- END DEBUGGING ---

    try {
      console.log('Loading translation model...');
      // Initialize the translation pipeline
      translator.value = await pipeline(
        'translation',
        'Xenova/nllb-200-distilled-600M',
        { local_files_only: true }
      );
      console.log('Translation model loaded successfully.');
    } catch (error: any) {
      console.error('Failed to load translation model:', error);
      translationError.value = error.message;
    } finally {
      isModelLoading.value = false;
    }
  });

  const translate = async (text: string, src_lang: string = 'deu_Latn', tgt_lang: string = 'eng_Latn') => {
    if (!translator.value) {
      console.warn('Translator not loaded yet.');
      return '';
    }
    if (isModelLoading.value) {
      console.warn('Model is still loading. Please wait.');
      return '';
    }
    if (!text.trim()) {
      return '';
    }

    try {
      // The `pipeline` function returns an array of results,
      // where each item has a `translation_text` property.
      const result = await translator.value(text, {
        src_lang: src_lang,
        tgt_lang: tgt_lang,
      });
      return result[0].translation_text;
    } catch (error: any) {
      console.error('Translation failed:', error);
      translationError.value = error.message;
      return '';
    }
  };

  return {
    translate,
    isModelLoading,
    translationError,
  };
}
