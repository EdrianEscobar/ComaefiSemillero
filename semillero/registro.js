const express = require('express');
const {engine} = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
//const dbConnection = require('./conexion/conexion'); // Importa la conexión desde conexion.js

//inicializaciones
const app = express();

//configuraciones
const port = 3000;
app.set('views', path.join(__dirname,'vistas'))
app.engine('.hbs',engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');



//midlewares
// se agrego cors para la comunicacion entre el front y el back
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(cors());


//archivos publicos
app.use(express.static(path.join(__dirname,'publicos')));

// Configurar la conexión a Oracle (debes llenar la información de conexión)
//oracledb.initOracleClient({ libDir: 'C:\\Program Files\\Oracle\\instantclient_21_12'});
app.use(require('./rutas/index'))

app.listen(port, () => {
  console.log(`Servidor Node.js en ejecución en el puerto ${port}`);
});
