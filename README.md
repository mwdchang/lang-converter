## Lang-Converter
An Android app from doing offline language translations.

An inquiry into (mostly) vibe-coding of an offline language translation application. 
Why you ask? Because I don't want to bankrupt myself paying accidental roaming charges out of the country, and existing services claiming to have offline modes either have quirks(*cough* googlemaps *cough*) or do not work exactly the way I want them to work.


### Ab-Initio
Initial research and prodding manually: just to see what combinations of options are available as I last touched Android development years ago and a lot of things had changed. After a bit of poking around my basic requirements:
- Minimal Java if possible
- The models for OCR and translation should be offline

Internet and ChatGPT seem to think this is possible. TesseractJS which I had used before handles the OCR, and suggested maybe transformer.js for the translation model.

Alternatively, running something like a quantized LLM as a service seems to be possible, but seemingly requires a lot more specialized setup, is hackier, and more fragile in general.


### Step 0: Requirement
Asked Gemini-Cli to generate a `requirement.md` file based on a list of requirement (see `prompt.md`). The requirement it made makes sense and have things mostly in the correct order, but some prunning was done around testing plans just to avoid getting into too much of a rabbit hole with so many unknowns already on hand.


### Step 1: Basic app, setup and plumbing
Phase 1 consist of setting up the views and plumbing to building APKs. Asked Gemini-CLI to create a `phase1.md` file it can work off. This went off the rails rather quickly, `npm` and `vue` related processes installed into the wrong directories and had to start over several times.

Andriod Studio was a manual process, a few hiccups but mostly due to not knowing where things are located in the IDE and PATH settings. Build took a bit of time (initial package downloads) but mostly smooth, app opens and works with placeholder views.


### Step 2: Translation model integration
Gemini wanted to use TensorflowJS, fine, but then claims that it couldn't find appropriate pretrainned models but was going ahead anyway?? So instead prompted the Gemini to research transformerJS instead, then had to further prompt Gemini to not use an outdated version of transformerJS. Gemini could not download the model file so they had to be pulled down manually from hugginface (https://huggingface.co/Xenova/nllb-200-distilled-600M). The model has a lot more supported languages than I asked for, so the files are pretty hefty with encoder/decoder at 450mb each respectively. Gemini misconfigured offline mode for transformerJS several times, but all things considered had the page working after 5 minutes. Unsurprisingly running a big model on a webpage is a tad slow, but the plumbing works and maybe can search for a smaller model later.


### Intermission 1: Testing on cellphone
Well it turned out that the model is indeed too big. Test run resulted in the application crashing with OOM in the logs


#### t5-small
Trying out quantized t5-small instead, this works but is English centric, so English => X is okay, but X => English is flaky.

See: https://huggingface.co/Xenova/t5-small

#### opus-mt-de-en
Trying out a dedicated model, this is 1/10th the size of NLLB model and is specific. Took 5-10 seconds to load on phone, but actually works afterward !!

See: https://huggingface.co/Xenova/opus-mt-de-en








```
npm run build
npx cap sync
npx cap open android

/* build in studio */

adb install <path to apk> 

```
