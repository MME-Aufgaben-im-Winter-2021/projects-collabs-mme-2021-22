const CONFIG = {
    DURATION_ERROR_ANIMATION_MS: 1000,
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyDHqRM-DLac7aemKhagUREQ2ZlvgeWds18",
        authDomain: "collabs-3b5fa.firebaseapp.com",
        databaseURL: "https://collabs-3b5fa-default-rtdb.europe-west1.firebasedatabase.app/",
        projectId: "collabs-3b5fa",
        storageBucket: "collabs-3b5fa.appspot.com",
        messagingSenderId: "199045855028",
        appId: "1:199045855028:web:04d45c2c4f90e727639761",
        measurementId: "G-LCTRQ6PWV9",
    },
    API_KEY: "5caebdcd7bf3424fb74f26ee7d4fd33d",
    // wenn man die Seite als scrollbare Version haben will &scroll_page=true in den Link
    SCREENSHOT_API: "https://api.apiflash.com/v1/urltoimage?access_key=$API_KEY&url=$URL&format=png&width=$WIDTH&height=$HEIGHT&quality=100&response_type=json",
    SCREENSHOT_WIDTH: 1920,
    SCREENSHOT_HEIGHT: 1080,
};

Object.freeze(CONFIG);

export default CONFIG;