# Language Translator Android App: Requirements (Offline First)

## 1. Project Overview

This document outlines the requirements for an Android language translator application built with Vue.js 3, TypeScript, and Capacitor. The application will perform offline translation of German text to English. It will feature real-time camera-based translation, manual text translation, and a history of past translations.

**A critical requirement is that the application must be fully functional offline. All assets, including text recognition (OCR) and translation models, must be packaged within the application and loaded locally at runtime.**

## 2. Core Features

The application will be composed of three primary views:

### a. Camera Translation View (Main View)
-   **Functionality:** Activates the phone's camera to provide a live feed.
-   **Text Recognition:** Continuously captures frames from the video feed and uses an on-device OCR model to detect and extract German text.
-   **Translation:** The extracted German text is immediately translated to English using an on-device translation model.
-   **Overlay:** The English translation is rendered as an overlay on top of the original German text in the camera view, positioned at the location of the detected text.
-   **History:** Each successful (German, English) translation pair is automatically saved to a persistent history log.

### b. Text-to-Text Translation View
-   **Functionality:** Provides a simple interface with a text input area.
-   **Input:** Users can manually type or paste German text into the input field.
-   **Translation:** A "Translate" button triggers the on-device translation model to convert the German text to English.
-   **History:** The (German, English) translation pair is saved to the history log upon successful translation.

### c. History View
-   **Functionality:** Displays a list of all past translations from both the Camera and Text-to-Text views.
-   **Display:** Each entry will clearly show the original German text and its English translation.
-   **Management:**
    -   Users can delete individual entries from the history.
    -   A "Clear All" button allows users to delete the entire translation history.

## 3. Technology Stack

-   **Core Framework:** Vue.js 3 (Composition API)
-   **Language:** TypeScript
-   **Mobile Platform:** Capacitor to compile the web app into a native Android application.
-   **UI/UX:** Vue Router for navigation between views.
-   **On-device OCR:** A JavaScript-compatible OCR library (e.g., Tesseract.js). **The German language model (`.traineddata`) must be bundled with the app in the `public/` directory and configured to be loaded locally.**
-   **On-device Translation:** A lightweight, embeddable translation model (e.g., a TensorFlow.js model). **The model files must be included in the `public/` directory and loaded from within the app, not from an external URL.**
-   **Persistence:** Capacitor Storage API for managing the translation history.

## 4. Step-by-Step Implementation Plan

### Phase 1: Project Setup & UI Scaffolding
1.  Initialize a new Vue.js 3 project using Vite with TypeScript.
2.  Install and configure Capacitor for the Android platform.
3.  Set up Vue Router to manage navigation between the three main views.
4.  Create placeholder components for each of the three views.

### Phase 2: Offline Text-to-Text Translation
1.  **Model Acquisition:** Research and download a suitable, pre-trained German-to-English translation model compatible with TensorFlow.js. Place the model files in the project's `public/models/` directory.
2.  **Integration:** Implement the UI for the Text-to-Text view. Integrate the translation library and write a `useTranslation` composable that loads the model from the local app assets and performs translation.
3.  **Functionality:** Implement the manual translation feature.

### Phase 3: History & Persistence
1.  Implement the UI for the History view.
2.  Use the Capacitor Storage API to save and retrieve translation history.
3.  Implement the logic to add new translations to the history from the Text-to-Text view.
4.  Implement the "delete entry" and "clear all" functionalities.

### Phase 4: Offline Camera View & OCR Integration
1.  **Model Acquisition:** Download the Tesseract.js German language data file (`deu.traineddata.gz`) and place it in `public/models/`.
2.  **Integration:** Implement the UI for the Camera Translation view using the Capacitor Camera plugin.
3.  **Configuration:** Integrate Tesseract.js and configure it to use the locally bundled language model, ensuring no network requests are made for model files.
4.  **Implementation:** Develop the logic to capture frames and send them to the OCR engine for text extraction.

### Phase 5: Overlay & Final Integration
1.  Implement the logic to overlay the translated text on the camera view. This will require obtaining bounding box coordinates from the OCR results.
2.  Connect the OCR output to the `useTranslation` composable.
3.  Ensure the translated pairs from the camera view are saved to the history.
4.  Refine the UI/UX and optimize performance, especially model loading times and the real-time processing loop.

## 5. How to Run and Install the Application

### a. Running the Application in Development
This workflow allows you to run the application on a real or virtual Android device, with support for live-reloading of your web-based code for rapid development.

1.  **Install Dependencies:** Before running for the first time, ensure all project dependencies are installed from your `package.json` file.
    ```bash
    npm install
    ```
2.  **Add Android Platform (One-time only):** If this is the first time setting up the project, add Android as a target platform for Capacitor. This creates the `android` directory.
    ```bash
    npx cap add android
    ```
3.  **Sync Web Assets:** The `sync` command is a crucial step. It builds your Vue.js application and copies the resulting web assets into the native Android project. It also processes and updates any Capacitor plugins. You should run this command whenever you add a new plugin or change native configurations.
    ```bash
    npx cap sync
    ```
4.  **Run on Device/Emulator:** This command bundles everything and runs the app on an attached Android device or an open emulator. It will prompt you to select a target if multiple are available.
    ```bash
    npx cap run android
    ```
    For a more integrated development experience, including viewing native logs (`logcat`) and advanced debugging, you can open the native Android project in Android Studio.
    ```bash
    npx cap open android
    ```
    You can then launch the app directly from Android Studio by clicking the 'Run' button (a green play icon).

### b. Installing the App on an Android Phone
This process describes how to create a distributable application file (`.apk`) and install it directly onto a phone.

1.  **Enable USB Debugging:** On your Android phone, go to `Settings > About phone`, and tap the "Build number" item 7 times. This will unlock "Developer options" in your main Settings menu. Go into `Settings > Developer options` and enable "USB debugging".
2.  **Connect Your Phone:** Connect your phone to your computer via a USB cable. You may see a prompt on your phone to "Allow USB debugging". Accept it.
3.  **Build an APK:**
    -   Open the project in Android Studio using `npx cap open android`.
    -   In Android Studio, go to the menu `Build > Build Bundle(s) / APK(s) > Build APK(s)`. This will compile your application and generate a debug version of the APK file.
4.  **Locate and Install the APK:**
    -   Once the build is complete, Android Studio will show a notification. You can click the "locate" link in the notification to open the folder containing the APK. The default path is `/android/app/build/outputs/apk/debug/app-debug.apk`.
    -   Use the Android Debug Bridge (`adb`), which is included with the Android SDK, to install the APK onto your connected device.
    ```bash
    adb install android/app/build/outputs/apk/debug/app-debug.apk
    ```
5.  After a "Success" message, the app will be installed and available in your phone's app drawer, ready to be launched.
