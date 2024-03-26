const oracle = require('oracledb');

async function conexion(){
    let con;

    try {
        con = await oracle.createPool({
            user: 'US_MOTRICIDAD',
            password: '11639',
            connectString: 'localhost/xe'
        });

        console.log('Conectado a Oracle');

        return con;

        
        
    } catch (err) {
        console.log('Error: ', err);
    }
}


module.exports = {
    conexion:conexion
};