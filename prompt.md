I want to build an Android app, in Typescript using Vue3 and capacitor. The idea is to build a language translator, where
texts are captures via the phone's camera/video, and the text (in german) is then translated to English.

All of this should work offline, so the text-extraction/text-recognition models, translation models are all on the phone as
part of the application.

The application itself will have three main views
- The main view where the camera is active, the image is sent for text extraction and then translation. The translated text
should be overlayed on top of the original text where they were extracted from. Moreover the (extraction, translation) pair
should be saved into a persistent history buffer
- A text-to-text view where we can enter the german text manually and get a translation. Likewise the (input, translation)
should be saved to history
- A history view, where past translations can be viewed. We should be able to remove individual entries, or to clear the
entire history.

Create a "requirement.md" file to outline in sufficient detail what needs to be done step-by-step. Also have a section
detailing how to run, test, and install the application as a an actual app onto an android phone.


Ask for clarifications, if somethings do not make sense let me know earlier than later.
