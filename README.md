# Safarika

Android app that helps first-time Indian exporters figure out what to sell, where, and what paperwork they need — in their own language.

India has 63M+ small businesses, but fewer than 12% export. The gap isn't ambition; it's information. Safarika pulls live trade data, classifies products to their HS codes, checks destination-country compliance rules, and explains everything in Hindi, Tamil, Marathi, or Gujarati.

## Stack

- **Mobile:** React Native (Expo) → Android APK
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **AI:** Gemini (classification, explanation, and multilingual translation)
- **Trade data:** UN Comtrade API, cached 7 days in MongoDB

## Project structure

```
safarika-project/
├── backend/
│   ├── server.js         # entry point
│   ├── routes/           # API endpoints
│   ├── services/         # Comtrade, HS code, translation logic
│   └── models/           # MongoDB schemas
├── mobile/
│   ├── App.js            # root component
│   ├── screens/          # UI screens
│   └── services/         # API client
├── docs/
├── docker-compose.yml
└── README.md
```

## Running locally

**Backend**

```bash
cd backend
cp .env.example .env      # fill in MONGODB_URI and API keys
npm install
npm run dev               # runs on http://localhost:3000
```

**Mobile**

```bash
cd mobile
npm install
npm start
```

Two ways to view the app:

- **Physical phone** — install Expo Go from the Play Store, connect to the same WiFi as your laptop, scan the QR code shown in the terminal
- **Android Studio emulator** — start the emulator first, then press `a` in the Expo terminal to install and launch the app on it

**Docker (backend + MongoDB together)**

```bash
docker-compose up -d
```

## API

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/health` | live |
| POST | `/api/market-demand` | live |
| POST | `/api/classify` | live |
| POST | `/api/compliance-check` | live |
| POST | `/api/translate` | live |

## Deployment

Backend → Google Cloud Run or Render.com  
Android APK → `eas build --platform android`

## Team

Hemanth, Shiva Rohith, Bhargav, Mahfuz