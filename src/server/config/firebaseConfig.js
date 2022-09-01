const { initializeApp } = require("firebase/app");
const { getStorage, ref, getBytes, deleteObject, uploadString, getDownloadURL,uploadBytes, getBlob, getMetadata, updateMetadata } = require("firebase/storage");
const admin = require('firebase-admin');
const { json } = require("body-parser");


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
const config = {
    "type": "service_account",
    "project_id": "panal-6aa84",
    "private_key_id": "e58408b8334007c175289c6e9d83c607f068bcfe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCd1oWpnvqOoEvs\nHim1Pxj1ZdI9kK5StxProgpRpLo+wqCZ3KY2XqIzIRC/T0Wo8v2PdI1/UriS8otO\nAIm+wzbjgdPagKbWjvc4swaSkb/36iaZJGazPE5VxCmMo0YIXASZch1Rqnd8XvML\nklYBzZJaikHZRHThlXCClo5h4ZYZZulBBxmqTd1Bo3yxMXsagn+xBX4gwiFyJJP8\nYpnAsb+OCM0fEb/AgCEI0b0RBAu6AuOSXEK+3v1/Ullgknkfvio+XlutjO+eOcuT\nyMqE88Tt3X0aWxcO6tKweGv1MPUcF3Y9edMaRdZTpmb+QEZYKMifKR0laxueE2kF\n2ICfzh5FAgMBAAECggEAGZIrJm9QpXG3yyGZ3TjDOOKNnJbHfzQU4JxocpCu8cMD\nVNoH/Y/4VDM7rNrRbM0tIiQeVm3W5EuyIOl6Z3Ll/hbG9UPZg7I2wDNU0cMWKDqB\nlVbt4oTXJhL5LkU3b9xEjH2N3XCyGe6iDpJfJ7yfxNZYU7RBAVj+GNH+cEIlWKjv\n13NZ1fPg1wi6JQKmt8k1mtEoA0pv+1/m+F1mD9cCOhHEBM23PIUu8WYhLXIgQuRV\n8UPqJtuL0Ekjvo5HyQJD2T9Vf3kO6TO3gokY6/Q2/v7W3lVWE6KYKwAf1E55wMKQ\n9EARG1O9rpeg/zQeyTpnzAvVnnxfDanH+IroZyuccQKBgQDSPetjPCi2kUS9e4mu\njuYvOiGYdWSeDAINzU/+Jvf3FlXxJI43tTI8/YPdSOKyw+wrQRcVogbhoc3MzUKy\nVgiGoOutclsFEaKdcWmUL8jokUgQjmQtc19YnDX9zeloc5P6U2KgvS90WvYmT7rK\nzXNGLNhkU21Ni4A2fhxhNSOJOQKBgQDAMM5nyNJrM+5P95YVeJOc4k+kUUNex1d5\n2DcpfSDSBpfv5IflAtGu46Coa7eODbcfkis15QWpp6eU9h5UEnzfdWUcto7qaQkc\nvnoVyyC8PZSq9EnYTvzjaxzhnH0J368rEv6hhL3rMSMgxlD4AdZomb70PxtKvQVG\np7u20hc5bQKBgQCct3NDIZDnphmrdO8Io5SKF7b7QmaiOSk+yJCcTsf/8zJU8n7g\nn7y3IfKtfKsfvlPJWleu1Hx0rHwP8eGJtf/c+w8y109p0993pRaiU4xbcBBb5whd\nqOal0qucaWVXavAfZRDb6Kn6/eMGY+BFVChdYwhaoKWVbCtCc3cMLuQyYQKBgQCP\nujAx90I9P6niDcMkrXae5bQvq0IZuDQX//VIxrXru1iW464pOtF62+pC6cNsrZ8c\nMiC0fmCcvq+Zu/F0aBsQted28KOyc/iHkX8Vm0IQ5HCw5F3xMSj4HhuMMY5k+u4x\n5VOdkPrCz414rjbRMfaZZRkj6anMW819SGUeVMFfhQKBgA0CzR1+NDF4DayKQUmf\nO0zra34kTrZtttV2mEBfLeJYTwU5xSPkxtvoaMKCDeZItlXesT03LbbaSSasvVDZ\n7g1BhdpAagvqbpSNWPh+WrGA/AmmKHsakKS07cx7wbNDC0eZxcDFRQ2MAV5Z5jCG\nUPIGNXIfFA8Nl/1KYrxHRlcQ\n-----END PRIVATE KEY-----\n",
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
    storage, ref, getBytes, deleteObject, uploadString, getDownloadURL, admin, getFile, existeFile, getFileRef, uploadBytes, getBlob, getMetadata, updateMetadata
}