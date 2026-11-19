# Headwork

A daily trainer for the skills I'm building: quant-level mental math, quant and machine learning, Spanish, the Microsoft DP-600 exam and the BDA (business data analytics) exam. It runs as a single web page and as an Android app that sends full-screen alerts when reviews are due.

## What's in it

| Area | What it does |
|---|---|
| **Mental math** | Practice drills that don't reveal which method to use, step-by-step worked explanations, Learn ladders for each concept, quant-firm speed targets, number-fact drills that bring slow facts back more often, and a review queue for the mistakes you make most. |
| **Quant & ML** | 54 lessons in 9 units (statistics, probability, inference, regression, linear algebra, calculus, forecasting, machine learning, AI systems). Every problem is a real calculation with fresh numbers and full working, and each lesson cites a textbook chapter. One new lesson a day, reviewed after 1, 3, 7, 14, 30 and 60 days. |
| **Spanish** | Phrase and word flashcards with spaced repetition, verb conjugation drills that diagnose the mistake, speaking prompts and a weekly check-up. |
| **DP-600** | 217 questions in the exam's formats: single answer, choose-two, Yes/No statements, sequences, code completion (SQL, PySpark, KQL, DAX) and two case studies. 100-minute mock exam and a study plan fitted to the exam date. |
| **BDA** | 249 flashcards imported from an Anki deck, plus a practice test built from them. |
| **Today** | Timers, what's due now, exam dates, streaks, progress charts, weekly check-ups, reminders and backup/restore. |
| **Method** | The research behind each technique, with links to the studies. |

### DP-600 question sources

The bank includes six scenarios adapted from the [Microsoft-DP-600 practice collection](https://github.com/pavithra-576/Microsoft-DP-600/blob/main/Practice%20questions/scenarios.md) under its MIT license. Headwork adds answer choices and clarifies the conditions for each solution. The license notice is included with the questions.

Microsoft Learn module assessments © Microsoft are used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Questions, choices and explanations were selected and reformatted from [Semantic model security](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/enforce-semantic-model-security/6-knowledge-check.yml), [Data governance](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/fabric-govern-analytics-data/6-knowledge-check.yml), [Model lifecycle](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/manage-semantic-model-lifecycle/8-knowledge-check.yml), [Monitoring](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/monitor-fabric-items/6-knowledge-check.yml), [Choosing a data store](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/choose-data-store-fabric/7-knowledge-check.yml), [Dimensional modeling](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/design-dimensional-models-fabric/7-knowledge-check.yml), [PySpark notebooks](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/fabric-transform-data-notebooks/7-knowledge-check.yml), [Warehouse transformations](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/fabric-transform-data-tsql/7-knowledge-check.yml), [Warehouse fundamentals](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/get-started-data-warehouse/8-knowledge-check.yml), [Lakehouses](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/get-started-lakehouses/6-knowledge-check.yml), [Model design](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/design-semantic-models-scale/7-knowledge-check.yml), [Model performance](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/optimize-semantic-model-performance/8-knowledge-check.yml), [Model metadata](https://github.com/MicrosoftDocs/learn/blob/a805cae34f7ebb539edc0e0c6c65d9b61fd8c134/learn-pr/wwl/fabric-prepare-semantic-layer/8-knowledge-check.yml).

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
app/index.html          The whole app: HTML, CSS, JavaScript and all question data in one file
android/build_dex.py    Hand-assembles classes.dex (no Android SDK needed)
android/AndroidManifest.xml
android/build_apk.py    Compiles the manifest, builds the DEX and zips the unsigned APK
android/sign.mjs        Signs the APK (v1, v2 and v3 signature schemes)
android/make_key.py     Creates a signing key, only if you don't have one
tools/anki_to_cards.py  Converts an Anki .apkg deck into the BDA card data
```

## Run the web version

Open `app/index.html` in a browser. Progress is saved in the browser's local storage on that device. Use **Today → Back up your progress** to move it to another device.

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
