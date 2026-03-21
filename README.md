## Lang-Converter
An Android app from doing offline language translations.

An inquiry into (mostly) vibe-coding an offline language translation application.


### Ab-Initio
Initial research and prodding manually: just to see what combinations of options are available as I last touched Android development years ago and a lot of things had changed. After a bit of poking around my basic requirements:
- Minimal Java if possible
- The models for OCR and translation should be offline

Internet and ChatGPT seem to think this is possible. TesseractJS which I had used before handles the OCR, and suggested maybe transformer.js for the translation model.


### Step 0: Requirement
Asked Gemini-Cli to generate a `requirement.md` file based on a list of requirement (see `prompt.md`). The requirement it made makes sense and have things mostly in the correct order, but some prunning was done around testing plans just to avoid getting into too much of a rabbit hole with so many unknowns already on hand.


### Step 1: Basic app, setup and plumbing
Phase 1 consist of setting up the views and plumbing to building APKs. Asked Gemini-CLI to create a `phase1.md` file it can work off. This went off the rails rather quickly, `npm` and `vue` related processes installed into the wrong directories and had to start over several times.

Andriod Studio was a manual process, a few hiccups but mostly due to not knowing where things are located in the IDE and PATH settings. Build took a bit of time (initial package downloads) but mostly smooth, app opens and works with placeholder views.


### Step 2: Translation model
TensorflowJS integration was a bit weird, prompted the Gemini-CLI to research transformerJS instead, then had to further prompt Gemini-CLI to not use an outdated version of transformerJS. Gemini could not download the model file so they had to be pulled down manually from hugginface (https://huggingface.co/Xenova/nllb-200-distilled-600M). The model has a lot more supported languages than I asked for, so the files are pretty hefty with encoder/decoder at 450mb each respectively. Gemini misconfigured offline mode for transformerJS several times, but all things considered had the page working after 5 minutes. Unsurprisingly running a big model on a webpage is a tad slow, but the plumbing works and maybe can search for a smaller model later.



