# Phase 4: Offline Camera View & OCR Integration

This document tracks the progress of implementing the Camera Translation view with Tesseract.js for OCR.

## Steps:

1.  [x] **Model Acquisition (Tesseract.js):** Download the Tesseract.js German language data file (`deu.traineddata.gz`) and place it in `ge-en/public/models/tessdata/`.
2.  [x] **Install Tesseract.js:** Install the `tesseract.js` library.
3.  [x] **Install Capacitor Camera Plugin:** Install the `@capacitor/camera` plugin.
4.  [x] **Implement UI for Camera Translation View:** Update `ge-en/src/views/CameraView.vue` to display a live camera feed. This view should prioritize the backfacing camera.
5.  [x] **Configuration (Tesseract.js):** Create a `useOCR` composable that integrates Tesseract.js and configures it to use the locally bundled German language model, ensuring no network requests are made.
6.  [x] **Implementation (OCR Logic):** Develop the logic within the `useOCR` composable and/or `CameraView.vue` to capture frames from the camera feed and send them to the OCR engine for German text extraction.
