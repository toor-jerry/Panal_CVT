Inicio:
node src/server/app.js


En produccion, borrar la carpeta "fontawesome-free" de Panal_CUVT\src\public\libs


En el servidor de desarrollo instalar nodemon para reiniciar el servidor:
npm i -g nodemon

alias app="cd ~/Escritorio/Panal_CUVT && nodemon src/server/app.js"
alias video="mpv --fs --no-audio ~/Escritorio/Panal_CUVT/Datos/Jerry_InterfazPanal.mp4 &"


Las variables de entorno PASSWORD es el cliente de gmail de google
https://myaccount.google.com/apppasswords?rapt=AEjHL4PvONfNoM-p0puHq0DSFJ7ukiq1GrNQH3Cm2UKoIDFxiPWAubO9CMZ2z599nESmFDENDt-p37apynCuBmSoy7wgoKSd6A


Solucion a auth de firebase:
https://stackoverflow.com/questions/37344066/firebase-this-domain-is-not-authorized

keyFirebase : 
es el json dado de 
https://console.firebase.google.com/project/panal-6aa84/settings/serviceaccounts/adminsdk?hl=es