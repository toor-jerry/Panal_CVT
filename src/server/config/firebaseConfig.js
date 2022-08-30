const { initializeApp } = require("firebase/app");
const { getStorage, ref, getBytes, deleteObject, uploadString, getDownloadURL,uploadBytes, getBlob } = require("firebase/storage");
const admin = require('firebase-admin');
const { json } = require("body-parser");


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

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.keyFirebase)),
})

function getFile(carpeta, idUsuario, extensionFile) {
    const fileRef = getFileRef(carpeta, idUsuario, extensionFile);
    const dateExp = new Date()

    dateExp.setHours(dateExp.getHours() + 1);
    return fileRef.getSignedUrl({action: 'read', expires: dateExp})
}


function existeFile(carpeta, idUsuario, extensionFile) { 
    
    return getFileRef(carpeta, idUsuario, extensionFile).exists()
}

function getFileRef(carpeta, idUsuario, extensionFile) {
    return admin.storage().bucket('gs://' + process.env.storageBucket).file(carpeta +'/' +idUsuario + extensionFile);
}

module.exports = {
    appFire,
    storage, ref, getBytes, deleteObject, uploadString, getDownloadURL, admin, getFile, existeFile, getFileRef, uploadBytes, getBlob
}