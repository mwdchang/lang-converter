import { ref, onMounted, onUnmounted } from 'vue';
import Tesseract, { createWorker, PSM } from 'tesseract.js';

interface OCRResult {
  text: string;
  boxes: Array<{ x0: number; y0: number; x1: number; y1: number; text: string }>;
}

export function useOCR() {
  const worker = ref<Tesseract.Worker | null>(null);
  const isOCRLoading = ref(true);
  const ocrError = ref<string | null>(null);

  onMounted(async () => {
    try {
      console.log('Initializing Tesseract.js worker...');

      worker.value = await createWorker('deu', 1, {
        // Paths to local Tesseract.js core files
        workerPath: '/tesseract-static/worker.min.js',       // Path to the worker script
        corePath: '/tesseract-static/',                     // Path to the directory containing WASM files
        // corePath: '/tesseract-static/tesseract-core.wasm.js',
        // Path to local language data
        langPath: '/models/tessdata/',
        logger: m => console.log(m), // Log Tesseract.js progress
      });

      // Set page segmentation mode for OCR
      await worker.value.setParameters({
        // tessedit_pageseg_mode: PSM.SPARSE_TEXT_OSD, // Adjust as needed for better results
        tessjs_create_hocr: '1'
      });
      
      console.log('Tesseract.js worker initialized.');
    } catch (error: any) {
      console.error('Failed to initialize Tesseract.js worker:', error);
      ocrError.value = error.message;
    } finally {
      isOCRLoading.value = false;
    }
  });

  onUnmounted(async () => {
    if (worker.value) {
      console.log('Terminating Tesseract.js worker...');
      await worker.value.terminate();
      worker.value = null;
      console.log('Tesseract.js worker terminated.');
    }
  });

  const recognize = async (image: string | HTMLCanvasElement): Promise<Tesseract.RecognizeResult | null> => {
    if (!worker.value) {
      ocrError.value = 'Tesseract.js worker not initialized.';
      return null;
    }
    if (isOCRLoading.value) {
      ocrError.value = 'Tesseract.js worker is still loading.';
      return null;
    }

    try {
      // const { data: { text, words } } = await worker.value.recognize(image);
      const ocrResult = await worker.value.recognize(image, {}, {
        blocks: true
      });
      
      // const ocrResult = await worker.value.recognize('gutentag.jpg', {}, {
      //   blocks: true
      // });

      console.log('OCR Result:', ocrResult);
      return ocrResult;

      // Extract bounding boxes for words
      // const boxes = words.map(word => ({
      //   x0: word.bbox.x0,
      //   y0: word.bbox.y0,
      //   x1: word.bbox.x1,
      //   y1: word.bbox.y1,
      //   text: word.text,
      // }));

      // return { text, boxes };
    } catch (error: any) {
      console.error('OCR failed:', error);
      ocrError.value = error.message;
      return null;
    }
  };

  return {
    recognize,
    isOCRLoading,
    ocrError,
  };
}
