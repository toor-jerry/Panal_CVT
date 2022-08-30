const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadString, deleteObject, getBytes } = require("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBt5cFXrI0D0NF4AJ1TQJRmd6X3WUOnuLs",
    authDomain: "panal-6aa84.firebaseapp.com",
    databaseURL: "https://panal-6aa84-default-rtdb.firebaseio.com",
    projectId: "panal-6aa84",
    storageBucket: "panal-6aa84.appspot.com",
    messagingSenderId: "390583139213",
    appId: "1:390583139213:web:e16721c150ef8fb4871bc4",
    measurementId: "G-V5E33ME7XZ"
  };

const appFire = initializeApp(firebaseConfig);
const storage = getStorage(appFire);