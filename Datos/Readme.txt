Inicio:
node src/server/app.js


En produccion, borrar la carpeta "fontawesome-free" de Panal_CUVT\src\public\libs


En el servidor de desarrollo instalar nodemon para reiniciar el servidor:
npm i -g nodemon

alias app="cd ~/Escritorio/Panal_CUVT && nodemon src/server/app.js"
alias video="mpv --fs --no-audio ~/Escritorio/Panal_CUVT/Datos/Jerry_InterfazPanal.mp4 &"
