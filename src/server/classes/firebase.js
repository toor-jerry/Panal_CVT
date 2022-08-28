const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadString, deleteObject, getBytes } = require("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket:process.env.storageBucket,
    messagingSenderId:process.env.messagingSenderId ,
    appId:process.env.appId,
    measurementId:process.env.measurementId
};

const appFire = initializeApp(firebaseConfig);
const storage = getStorage(appFire);