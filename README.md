# Travel Task App

## Add Firebase Configuration

* Add file in firebase.js in folder /src/config/firebase.js
* Create you firebase app at https://console.firebase.google.com
* copy code like 
    ```javascript
    import firebase from 'firebase';
        var firebaseConfig = {
          apiKey: "YOUR_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          databaseURL: "YOUR_DATABASE_URL",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
          measurementId: "YOUR_MEASUREMENT_ID",
    };
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    export const db = firebaseApp.firestore();
    export const auth = firebaseApp.auth();
    export const storage = firebaseApp.storage();
    ```
* paste in folder /src/config/firebase.js

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

