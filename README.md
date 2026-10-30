# KetaPOS

KetaPOS is a native Android and iOS point-of-sale app for shops, cafes, and restaurants.

## Current starter

- Expo + React Native + TypeScript mobile project.
- Claymorphism onboarding in white, black, and metallic gray.
- Select a shop or cafe/restaurant business mode.
- Enter a business name and see the next setup step for that mode.

The onboarding now opens a mode-specific local POS screen. Users can add products or dishes, adjust cart quantities, select a recorded payment method, confirm sales, and view sale line items in session history. Cafe mode accepts an optional table number.

Business setup, catalog, cart, table/payment selection, and completed sales are stored on this device using SQLite. Checkout writes the sale and clears the cart in one durable snapshot before updating the UI. Storage failures leave the current UI state unchanged. Data is device-local; uninstalling the app can remove it. Selecting Card records a payment method only; it does not charge a card. Camera barcode scanning supports EAN-13, EAN-8, UPC-A, UPC-E, Code 128 and Code 39. Known codes add one product to the cart. Unknown codes fill the new-product barcode field; duplicate assigned codes are rejected. Camera permission is requested on use, with a settings link after permanent denial.

Authentication, backend sync/backup, kitchen workflow, actual payment processing, printers, and store submission remain to be implemented. This is currently one local business per device. Rebuild the native application after installing the new camera and SQLite dependencies. Native builds and device testing have not yet been performed.

## Run

Use Node.js 22.13 or later. From the repository root:

```sh
npm install
npm run start
```

Expo SDK 58 is recent and needs a development build until the matching Expo Go app is available. Android local builds use Android Studio; iOS local builds require macOS and Xcode. App Store and Google Play submissions also require the corresponding developer accounts.

The app identifiers in `app.json` are initial values and should be confirmed before store submission.
