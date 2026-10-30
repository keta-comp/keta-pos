# KetaPOS

KetaPOS is a native Android and iOS point-of-sale app for shops, cafes, and restaurants.

## Current starter

- Expo + React Native + TypeScript mobile project.
- Claymorphism onboarding in white, black, and metallic gray.
- Select a shop or cafe/restaurant business mode.
- Enter a business name and see the next setup step for that mode.

The onboarding is a UI starter and keeps its state in memory. Authentication, backend storage, catalog, barcode scanning, sales, payments, offline sync, printers, and store submission are future implementation steps.

## Run

Use Node.js 22.13 or later. From the repository root:

```sh
npm install
npm run start
```

Expo SDK 58 is recent and needs a development build until the matching Expo Go app is available. Android local builds use Android Studio; iOS local builds require macOS and Xcode. App Store and Google Play submissions also require the corresponding developer accounts.

The app identifiers in `app.json` are initial values and should be confirmed before store submission.
