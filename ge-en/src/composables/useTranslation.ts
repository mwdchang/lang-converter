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
    try {
      console.log('Loading translation model (Xenova/opus-mt-de-en)...');
      // Initialize the translation pipeline
      translator.value = await pipeline(
        'translation', // Task is 'translation'
        'Xenova/opus-mt-de-en', // Specify the model ID
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

  const translate = async (text: string, src_lang: string = 'de', tgt_lang: string = 'en') => { // Simple lang codes
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
      // OPUS-MT models do not require a prefix for the task
      const result = await translator.value(text, {
        src_lang: src_lang,
        tgt_lang: tgt_lang,
      });
      return result[0].translation_text; // Result is under translation_text
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
