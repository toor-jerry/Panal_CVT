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
const config = {
    "type": "service_account",
    "project_id": process.env.projectId,
    "private_key_id":process.env.private_key_id,
    "private_key": process.env.keyFirebase,
    "client_email": "firebase-adminsdk-cclw1@panal-6aa84.iam.gserviceaccount.com",
    "client_id": "109828602024577342729",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-cclw1%40panal-6aa84.iam.gserviceaccount.com"
  }
  
admin.initializeApp({
    credential: admin.credential.cert(config),
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