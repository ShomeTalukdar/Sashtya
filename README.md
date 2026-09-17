# 🏥 SWASTYA (स्वास्थ्य) — Patient-Centric Healthcare & Community Care Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

> **"Your health. Your family. One place."**  
> **SWASTYA** is a unified, accessible, and offline-first healthcare platform built to democratize healthcare navigation in India. From emergency SOS and prescription OCR to Ayushman Bharat scheme eligibility, medical bill auditing, and grassroots **ASHA worker preventive care tracking**, SWASTYA bridges the gap between rural community medicine and modern digital health infrastructure.

---

## 🌟 Key Features

### 🛡️ 1. Preventive Care & ASHA Worker Tracker
* **Dual Role Perspectives**: Switch between **Patient View** (personal immunization and screening timeline) and **ASHA / ANM Worker View** (community cohort tracking and care gap identification).
* **6-Stage Care Lifecycle Tracking**:
  $$\text{Recommended} \rightarrow \text{Due Date Set} \rightarrow \text{Appointment Booked} \rightarrow \text{Visit Completed} \rightarrow \text{Report Uploaded} \rightarrow \text{Care Completed}$$
* **Comprehensive Care Categories**: Immunization (BCG, OPV, Pentavalent, Measles-Rubella), non-communicable disease screenings (Hypertension, Diabetes, Cervical/Breast cancer), and prenatal/maternal checkups.
* **Timeline & Calendar Views**: Interactive calendar and milestone audit trail to prevent missed vaccination deadlines and routine checkups.

### 🚨 2. Emergency SOS & Quick Access Medical Card
* **One-Tap Emergency Call**: Direct integration with **108 Ambulance** and local emergency response hotlines.
* **GPS Location Sharing**: Instantly capture GPS coordinates and nearby landmark data with one-click clipboard copy or native sharing to emergency contacts.
* **Scannable Emergency QR Card**: Shows critical patient details offline (Blood Group, Allergies, Pre-existing Conditions, Emergency Contact) for paramedics and first responders.

### 🎙️ 3. Multilingual AI Health Assistant
* **Voice-First Navigation**: Conversational triage assistant that supports symptom checks, nearest doctor recommendations, and health queries.
* **4 Languages Supported**: Fully localized in **English**, **Hindi (हिन्दी)**, **Bengali (বাংলা)**, and **Odia (ଓଡ଼ିଆ)** with automatic native-script detection.
* **Text-to-Speech (TTS)**: In-browser voice synthesis for audio readouts, assisting illiterate and visually impaired users.

### 📷 4. AI Prescription OCR & Medicine Tracker
* **Prescription Scanning**: Convert physical doctor prescriptions into structured digital dosage schedules using simulated OCR processing.
* **Daily Adherence Tracking**: Dose logging with reminders (Morning, Afternoon, Night) and one-tap "Mark as Taken" tracking.

### 🏥 5. 24x7 Hospital & Bed Discovery
* Real-time directory of local government and private hospitals, Community Health Centres (CHCs), and Primary Health Centres (PHCs).
* Live indicators for **Ayushman Bharat PM-JAY Empanelment**, ICU availability, bed capacity, distance in kilometers, and estimated transit times.

### 🧾 6. Medical Bill Transparency & Audit
* **Line-Item Audit Engine**: Automated mathematical verification of hospital charges to detect calculation errors and prevent billing discrepancies.
* **Duplicate Charge Detection**: Highlights suspicious repeated diagnostic tests, consumable markups, or pharmacy line items.

### 🏛️ 7. Government Healthcare Schemes
* **Scheme Directory**: Curated guidance on **Ayushman Bharat (PM-JAY)**, **PM-BJP (Jan Aushadhi Pariyojana)**, and state welfare programs.
* **Income Eligibility Calculator**: Enter household income to verify whether your family qualifies for free or subsidized health coverage.

### 👵 8. Accessible "Simple Mode" & UI Themes
* **Senior-Friendly Simple Mode**: High-contrast, large-button interface with audio guidance designed for elderly and non-tech-savvy users.
* **Modern Design System**: Clean, minimalist UI inspired by Linear and Vercel with comprehensive **Dark Mode** and **Light Mode** support.

### 📶 9. Offline-First Architecture
* Full client-side persistence with fallback caching.
* Background **Sync Queue** that records offline actions and synchronizes automatically when internet connectivity resumes.

---

## 🌐 Supported Languages

| Language | Native Name | Code | UI & Assistant Support |
| :--- | :--- | :--- | :--- |
| **English** | English | `en` | Full UI & Voice Assistant |
| **Hindi** | हिन्दी | `hi` | Full UI & Voice Assistant |
| **Bengali** | বাংলা | `bn` | Full UI & Voice Assistant |
| **Odia** | ଓଡ଼ିଆ | `or` | Full UI & Voice Assistant |

---

## 🛠️ Tech Stack

* **Framework**: [React 18.3](https://react.dev/) + [TypeScript 5.7](https://www.typescriptlang.org/)
* **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + PostCSS + Autoprefixer
* **Icons**: [Lucide React](https://lucide.dev/)
* **Typography**: Google Fonts (*Inter* & *Manrope*)
* **APIs Used**:
  * Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
  * W3C Geolocation API (`navigator.geolocation`)
  * Web Share API (`navigator.share`)
  * LocalStorage & Custom Offline Sync Queue

---

## 📂 Project Structure

```text
Sashtya/
├── public/                    # Static assets & app icons
├── src/
│   ├── components/
│   │   ├── appointments/      # Doctor consultation & PHC slot booking
│   │   ├── assistant/         # Multilingual AI assistant drawer & speech UI
│   │   ├── bills/             # Medical bill auditor & transparency page
│   │   ├── emergency/         # SOS modal, location broadcaster & QR card
│   │   ├── family/            # Multi-member family health manager
│   │   ├── home/              # Patient dashboard, vitals, upcoming meds
│   │   ├── hospitals/         # 24x7 hospital finder & bed tracker
│   │   ├── insurance/         # Health insurance policy manager & claims
│   │   ├── layout/            # Sticky Header, Nav, Theme toggles & Lang switcher
│   │   ├── medicines/         # Prescription schedule & adherence logger
│   │   ├── Preventive_Care/   # ASHA worker & patient preventive lifecycle tracker
│   │   ├── records/           # Digital health records (EHR/PHR) & OCR upload
│   │   ├── reviews/           # Community doctor & hospital reviews
│   │   ├── schemes/           # Ayushman Bharat PM-JAY & benefit calculator
│   │   └── simple/            # Elderly/Simple Mode large-touch interface
│   ├── locales/               # i18n JSON translations (en, hi, bn, or)
│   ├── services/
│   │   ├── appointmentService.ts   # Appointment scheduling logic
│   │   ├── billService.ts          # Bill verification & anomaly detection
│   │   ├── emergencyService.ts     # GPS location, SOS dialing & QR card
│   │   ├── familyService.ts        # Family profiles & shared records
│   │   ├── hospitalService.ts      # Hospital directory & bed availability
│   │   ├── medicationService.ts    # Dose timing, notifications & compliance
│   │   ├── ocrService.ts           # Prescription scanning & entity extraction
│   │   ├── preventiveCareService.ts# Community care stages & ASHA metrics
│   │   ├── schemeService.ts        # Welfare program rules & income checks
│   │   ├── storageService.ts       # LocalStorage wrapper & offline sync queue
│   │   └── voiceService.ts         # Multilingual AI conversational engine
│   ├── types/                 # TypeScript interfaces and data models
│   ├── App.tsx                # Master container, state orchestration & routing
│   ├── index.css              # Global styles & Tailwind directives
│   └── main.tsx               # Application bootstrap
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
