# KetaPOS

KetaPOS is a native Android and iOS point-of-sale app for shops, cafes, and restaurants.

## Current starter

- Expo + React Native + TypeScript mobile project.
- Claymorphism onboarding in white, black, and metallic gray.
- Select a shop or cafe/restaurant business mode.
- Enter a business name and see the next setup step for that mode.

The onboarding now opens a mode-specific local POS screen. Users can add products or dishes, adjust cart quantities, select a recorded payment method, confirm sales, and view sale line items in session history. Cafe mode accepts an optional table number.

All data currently lives in memory and is lost when the app closes. Selecting Card records a payment method only; it does not charge a card. Authentication, durable storage, camera barcode scanning, backend sync, kitchen workflow, actual payment processing, printers, and store submission remain to be implemented. Native builds and device testing have not yet been performed.

## Run

Use Node.js 22.13 or later. From the repository root:

```sh
npm install
npm run start
```

Expo SDK 58 is recent and needs a development build until the matching Expo Go app is available. Android local builds use Android Studio; iOS local builds require macOS and Xcode. App Store and Google Play submissions also require the corresponding developer accounts.

The app identifiers in `app.json` are initial values and should be confirmed before store submission.
