# Headwork

A daily trainer for the skills I'm building: quant-level mental math, quant and machine learning, Spanish, the Microsoft DP-600 exam and the BDA (business data analytics) exam. It runs as a web page with local source exhibits and as an Android app that sends full-screen alerts when reviews are due.

## What's in it

| Area | What it does |
|---|---|
| **Mental math** | Practice drills that don't reveal which method to use, step-by-step worked explanations, Learn ladders for each concept, quant-firm speed targets, number-fact drills that bring slow facts back more often, and a review queue for the mistakes you make most. |
| **Quant & ML** | 54 lessons in 9 units (statistics, probability, inference, regression, linear algebra, calculus, forecasting, machine learning, AI systems). Every problem is a real calculation with fresh numbers and full working, and each lesson cites a textbook chapter. One new lesson a day, reviewed after 1, 3, 7, 14, 30 and 60 days. |
| **Spanish** | Phrase and word flashcards with spaced repetition, verb conjugation drills that diagnose the mistake, speaking prompts and a weekly check-up. |
| **DP-600** | 235 graded questions, including 60 PDF practice adaptations. Guided reasoning prompts, hints, retries and explanations for mistakes in drills and mock review. A searchable offline library preserves all 198 supplied PDF questions across 169 pages. 100-minute mock exam and a study plan fitted to the exam date. |
| **BDA** | 249 flashcards imported from an Anki deck, plus a practice test built from them. |
| **Today** | Timers, what's due now, exam dates, streaks, progress charts, weekly check-ups, reminders and backup/restore. |
| **Method** | The research behind each technique, with links to the studies. |

### Spacing fitted to exam dates

DP-600 and BDA items follow successive relearning ([Rawson & Dunlosky, 2011](https://doi.org/10.1037/a0023956)): each item is recalled correctly several times on the first day (after 1 and 10 minutes), then reviewed on separate days. Once you set an exam date, the gap between reviews is capped at a share of the days left, following [Cepeda et al., 2008](https://pubmed.ncbi.nlm.nih.gov/19076480/): about 30% with a week to go, falling to 7% with a year to go. New items are paced so everything is introduced with time for three spaced reviews, and every item gets a final review the day before the exam.

### Reminders (Android)

- Full-screen alerts at 12:30 PM, plus 6 PM and 9 PM if anything is still due.
- Alerts at the 1- and 10-minute same-day checks.
- A 7:30 AM alert in the week before an exam.
- Quiet hours from 10:30 PM to 7 AM.
- Tapping an alert opens the most urgent review, even over the lock screen.

## Repository layout

```
app/index.html          App HTML, CSS, JavaScript and embedded question data
app/dp600-source/       Offline PDF page exhibits (WebP)
tools/dp600-content.mjs Authored, documented practice adaptations and Socratic hints
tools/dp600-source-index.json  Source question numbers, page mapping and extracted text
tools/build-dp600.mjs   Rebuilds the generated DP-600 content block in index.html
tests/dp600.test.mjs    Content validation and browser regression tests
android/build_dex.py    Hand-assembles classes.dex (no Android SDK needed)
android/AndroidManifest.xml
android/build_apk.py    Compiles the manifest, builds the DEX and zips the unsigned APK
android/sign.mjs        Signs the APK (v1, v2 and v3 signature schemes)
android/make_key.py     Creates a signing key, only if you don't have one
tools/anki_to_cards.py  Converts an Anki .apkg deck into the BDA card data
```

## Run the web version

Open `app/index.html` in a browser. Progress is saved in the browser's local storage on that device. Use **Today → Back up your progress** to move it to another device.

Keep `app/dp600-source/` beside `index.html` when copying or hosting the web app. The Android build packages this directory too, so source pages work offline without a PDF viewer.

### DP-600 PDF practice

**DP-600 → Drill → PDF practice** selects the new bank. Each graded item links to its source question and supporting technical documentation. On a wrong answer, the correct options remain hidden while you work through a prompt, request a further hint, or retry. **Show explanation** is always available. A guided retry never changes the first-attempt score or postpones the review. Mock questions have no coaching until the mock is finished.

**DP-600 → PDF questions** browses all 198 original questions and their page images, including case-study context and image-based answer areas. Search, enlarge exhibits, and save personal reasoning notes. Notes travel with the existing progress backup.

The source is `exam_070825_id_72_no_discussion_no_answer.pdf`, supplied by the repository owner. It contains no answer key. The 60 authored adaptations cover 71 source numbers (repeated questions share an adaptation); the other 127 are explicitly reference-only and never enter graded drills or mocks. Adaptations are not verbatim transcriptions or an official key. Some clarify missing context or update older behavior, such as GitHub support and the distinction between Direct Lake on SQL endpoints and Direct Lake on OneLake. Documentation was checked on November 24, 2026. The original 175 question IDs and saved review history are retained.

To edit the new practice content, change `tools/dp600-content.mjs`, then run:

```bash
npm ci
npm run build:dp600
npx playwright install chromium
npm test
```

Tests cover source page completeness, answer shapes, generated-data consistency, all four answer formats, hidden answers before reveal, repeated retries without regrading, mock review, saved notes/backups, mobile overflow and other section navigation. To use an installed Chrome/Edge instead of downloading Chromium, set `HEADWORK_BROWSER` to its executable path. Browser checks do not replace testing on an Android device.

## Build the Android app

```bash
pip install -r android/requirements.txt
(cd android && npm install)
python3 android/build_apk.py        # -> android/out/unsigned.apk
# put key.pem and cert.pem in android/keys/ (from your saved signing-key zip), then:
node android/sign.mjs               # -> android/out/Headwork.apk
```

The app is a WebView that loads `app/index.html` from the APK's assets, with a JavaScript bridge (`window.HWAndroid`) for alarms, notifications, permission checks and sharing backups. The package name is `com.headwork.app`, with minimum SDK 26 and target SDK 34.

**Signing key:** updates install over an existing copy only if they're signed with the same key. The key is not in this repository, and `.gitignore` keeps it out. Keep the signing-key zip somewhere safe. If you lose it, back up your progress, uninstall, install the new build and restore.

Before you change `build_dex.py`, note that the bytecode is written by hand: register numbers, branch offsets and method signatures must be exact. For any new `@JavascriptInterface` method, pass `annotated=True`.
