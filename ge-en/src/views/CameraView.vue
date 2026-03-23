<template>
  <div class="camera-container">
    <h1>Camera Translation</h1>
    <div v-if="!hasCameraPermission" class="permission-message">
      <p>Please grant camera permission to use this feature.</p>
      <button @click="checkAndRequestCameraPermission">Grant Permission</button>
    </div>

    <div class="camera-content">
      <div class="camera-feed-wrapper">
        <video ref="videoElement" autoplay playsinline class="camera-feed"></video>
        <canvas ref="canvasElement" class="hidden"></canvas> <!-- Hidden by default -->
        <div v-if="ocrResult && ocrResult.boxes && videoWidth > 0 && videoHeight > 0" class="ocr-overlay">
          <div
            v-for="(box, i) in ocrResult.boxes"
            :key="i"
            class="word-box"
            :style="{
              left: `${(box.x0 / videoWidth) * 100}%`,
              top: `${(box.y0 / videoHeight) * 100}%`,
              width: `${((box.x1 - box.x0) / videoWidth) * 100}%`,
              height: `${((box.y1 - box.y0) / videoHeight) * 100}%`,
            }"
          >
            {{ box.text }}
          </div>
        </div>
      </div>

      <button
        @click="captureAndRecognize"
        :disabled="!videoReady || isOCRLoading || capturing"
        class="capture-button"
      >
        {{ isOCRLoading ? 'Loading OCR Engine...' : (capturing ? 'Processing...' : 'Capture for OCR') }}
      </button>

      <div v-if="ocrError" class="error-text">
        OCR Error: {{ ocrError }}
      </div>

      <div v-if="ocrResult && ocrResult.text" class="ocr-output-section">
        <h2>Recognized Text:</h2>
        <p>{{ ocrResult.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core'; // Import Capacitor
import { useOCR } from '@/composables/useOCR';

const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const videoReady = ref(false);
const capturing = ref(false);
const hasCameraPermission = ref(false); // Assume false initially, will be set after checks
const videoWidth = ref(0);
const videoHeight = ref(0);

const { recognize, isOCRLoading, ocrError } = useOCR();
const ocrResult = ref<any>(null);

let stream: MediaStream | null = null;

const checkAndRequestCameraPermission = async () => {
  if (Capacitor.isNativePlatform()) { // Use Capacitor.isNativePlatform()
    // Native platform (Android/iOS)
    try {
      const status = await Camera.checkPermissions();
      if (status.camera === 'granted') {
        hasCameraPermission.value = true;
        startCamera();
      } else {
        const permissions = await Camera.requestPermissions({ permissions: ['camera'] });
        if (permissions.camera === 'granted') {
          hasCameraPermission.value = true;
          startCamera();
        } else {
          hasCameraPermission.value = false;
          alert('Camera permission denied. Please enable it in your device settings.');
        }
      }
    } catch (error) {
      console.error('Error handling native camera permission:', error);
      hasCameraPermission.value = false;
      alert('Could not handle native camera permission.');
    }
  } else {
    // Web platform
    // Attempt to start camera directly, getUserMedia will prompt for permission
    console.log('starting web........');
    startCamera();
  }
};

const startCamera = async () => {
  console.log('Starting camera ......................');
  try {
    // Attempt to get the back camera using ideal 'environment' facing mode
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });

    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      videoElement.value.onloadedmetadata = () => {
        videoReady.value = true;
        hasCameraPermission.value = true; // Granted for web if stream is successful
        videoWidth.value = videoElement.value?.videoWidth || 0;
        videoHeight.value = videoElement.value?.videoHeight || 0;
      };
    }
  } catch (environmentError) {
    console.warn('Could not access environment camera directly, trying generic camera. Error:', environmentError);
    // Fallback to any available camera if 'environment' ideal fails
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoElement.value) {
        videoElement.value.srcObject = stream;
        videoElement.value.onloadedmetadata = () => {
          videoReady.value = true;
          hasCameraPermission.value = true;
          videoWidth.value = videoElement.value?.videoWidth || 0;
          videoHeight.value = videoElement.value?.videoHeight || 0;
        };
      }
    } catch (genericError) {
      console.error('Error accessing any camera:', genericError);
      hasCameraPermission.value = false; // Permission denied for web
      alert('Could not access the camera. Please ensure no other app is using it or permission is granted.');
    }
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    videoReady.value = false;
  }
};

const captureAndRecognize = async () => {
  if (!videoReady.value || !videoElement.value || !canvasElement.value || isOCRLoading.value) return;

  capturing.value = true;
  ocrResult.value = null; // Clear previous OCR result

  const video = videoElement.value;
  const canvas = canvasElement.value;
  const context = canvas.getContext('2d');

  if (context) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Perform OCR on the captured canvas image
      const result = await recognize(canvas);
      // const result = await recognize(canvas.toDataURL('image/png'));

      if (result) {
        ocrResult.value = result;
      }
    } catch (error) {
      console.error('OCR recognition failed:', error);
    }
  }
  capturing.value = false;
};

onMounted(() => {
  checkAndRequestCameraPermission();
});

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.camera-container {
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

.permission-message {
  text-align: center;
  margin-top: 50px;
}

.camera-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.camera-feed-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px; /* Adjust as needed */
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: black; /* To ensure black background for video */
}

.camera-feed {
  width: 100%;
  height: auto;
  display: block;
  /* transform: scaleX(-1); /* Removed mirror effect for back camera */
}

.capture-button {
  display: block;
  width: fit-content;
  margin: 15px auto 0;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.capture-button:hover:not(:disabled) {
  background-color: #218838;
}

.capture-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/*
.hidden {
  display: none;
}
*/

.ocr-output-section {
  width: 100%;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 15px;
  min-height: 80px;
  margin-top: 20px;
}

.ocr-output-section h2 {
  color: #555;
  margin-top: 0;
  margin-bottom: 10px;
}

.ocr-output-section p {
  color: #666;
  font-size: 1.1rem;
  white-space: pre-wrap;
}

.error-text {
  color: #dc3545;
  font-weight: bold;
  margin-top: 10px;
}

.ocr-overlay {
  position: absolute;
  border: 1px solid rgba(255, 0, 0, 0.7); /* Red box for identified words */
  background-color: rgba(255, 0, 0, 0.2); /* Semi-transparent red fill */
  color: white; /* Make text visible over box */
  font-size: 0.8em; /* Smaller text */
  padding: 2px;
  box-sizing: border-box;
  overflow: hidden; /* Hide overflowing text */
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 1px 1px 2px black; /* Make text more readable */
}
</style>
