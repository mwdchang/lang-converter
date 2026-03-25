# Phase 2: Offline Text-to-Text Translation (using Transformers.js)

This document tracks the progress of implementing offline text-to-text translation using the Transformers.js library.

## Steps:

1.  [x] **Install Transformers.js:** Add the `@huggingface/transformers` library to the project.
2.  [ ] **Model Acquisition:** Find and download a suitable, pre-trained German-to-English translation model from the Hugging Face Hub (e.g., from the `Xenova` user). The model files will be placed in the project's `public/models/` directory.
3.  [x] **Integration (UI):** Implement the UI for the Text-to-Text view (`ge-en/src/views/TextView.vue`). This will include a text input area, a "Translate" button, and an area to display the result.
4.  [x] **Integration (Translation Logic):** Create a `useTranslation` composable that:
    -   Imports the `pipeline` function from `@huggingface/transformers`.
    -   Initializes the translation pipeline, configuring it to load the model from the local `public/models/` directory.
    -   Exposes a `translate` function.
5.  [x] **Functionality:** Implement the manual translation feature in the `TextView` component, calling the `translate` function from the `useTranslation` composable when the "Translate" button is clicked.