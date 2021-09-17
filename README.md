# WChallenge

Este es un proyecto donde se desarrolla una API que expone un servicio http y que permite crear diferetes usuarios y con ellos realizar transacciones y/o consultas a la API de CoinGecko para obtener toda la información de las criptomonedas comerciales que existen. 

Cada usuario puede, por medio de autenticación, agregarse las criptomonedas que desee y también agregar las monedas favoritas para obtener su TOP N de acuerdo a la ultima cotización de la moneda. 

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

### Pre-requisitos del proyecto📋

_Para poner en funcionamiento la API y realizar pruebas, debes tener instalado las siguientes tecnologías:_ 

* [Node.js](https://nodejs.org/es/) - Entorno de ejcución para JavaScript
* [MongoDB](https://www.mongodb.com/) - Base de datos NO Relacional
* [Postman](https://www.postman.com/) - Cliente para hacer peticiones HTTP (puedes utilizar el que desees).

### Instalación y Ejecución 🔧

_A continuación, esta el paso a paso que debes seguir para tener un entorno de desarrollo ejecutandose_

_Lo primero, desde una consola, descarga el repositorio desde GitHub con la siguiente instrucción_

```
git clone https://github.com/JaverBena/WChallenge.git
```

_Ingresa a la carpeta o directorio descargado (WChallenge)_

_Ejecuta el siguiente comando en consola:_

```
npm start
```

_Y listo. Recuerda antes de realizar peticiones asegurarse de tener ejecutandose el servicio de MongoDB_

## Ejecutando las pruebas ⚙️

_Para ejecutar las pruebas unitarias, ejecuta el siguiente comando desde una consola dentro del directorio descargado de GitHub_

```
npm run test
```

_Para ejecutar las pruebas y revisar el coverage en el navegador, ejecuta el siguiente comando:_

```
npm run test:cov
```

_Despues de que se ejecuten las pruebas, debes entrar al directorio creado "coverage" y abrir desde un navegador el archivo "index.html". Allí puedes encontrar la cobertura del testing ejecutado._

## Autor ✒️

* **Javer Andrés Benavidez**