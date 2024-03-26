const express = require('express');
const router = express.Router();
const db = require('../conexion/conexion')
const cors = require('cors');



router.post('/registrar', async (req, res) => {
    console.log(req.body);
    const { id, nombre, apellido1, apellido2, contacto, contrasena } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario  
        const result = await conn.execute(`
            INSERT INTO USUARIOS (
                ID_USUARIO, 
                NOMBRE_USUARIO, 
                P_APELL_USUARIO, 
                S_APELL_USUARIO,
                NROCONT_USUARIO, 
                CLAVE_USUARIO,
                ID_PERFIL
            ) VALUES (
                ${id}, 
                '${nombre}', 
                '${apellido1}',
                '${apellido2}', 
                '${contacto}', 
                '${contrasena}',
                1
        )`);
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Usuario agregado con exito');
            res.status(200).json({ status: 'Correcto', message: 'Usuario creado con exito' });

        } else {
            await conn.release();
        }


    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario en la base de datos');
    }
});

router.post('/login', async (req, res) => {
    const { id, contrasena } = req.body; // Obtener los datos del formulario

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales y obtener el rol
        const login = await conn.execute(`
            SELECT U.ID_USUARIO, U.CLAVE_USUARIO, U.ID_PERFIL, U.NOMBRE_USUARIO
            FROM USUARIOS U
            WHERE U.ID_USUARIO = :id AND U.CLAVE_USUARIO = :contrasena
        `, [id, contrasena]);
        

        
        console.log(login); // Verificar el resultado de la consulta en la consola del servidor

        if (login.rows.length === 1) {
            const usuario = login.rows[0];
            const consultapermisos = await conn.execute(`
            SELECT
                U.ID_USUARIO,
                P.ID_PERFIL,
                F.ID_FORMULARIO,
                F.NOMBRE_FORMULARIO,
                F.URL_FORMULARIO,
                PM.CREAR_PERMISO,
                PM.BUSCAR_PERMISO,
                PM.ACTUALIZAR_PERMISO,
                PM.ELIMINAR_PERMISO
            FROM
                USUARIOS U
            JOIN
                PERFILES P ON U.ID_PERFIL = P.ID_PERFIL
            LEFT JOIN
                PERMISOS PM ON P.ID_PERFIL = PM.ID_PERFIL_PERMISO
            LEFT JOIN 
                FORMULARIOS F ON PM.ID_FORMULARIO_PERMISO = F.ID_FORMULARIO
            WHERE
                U.ID_USUARIO = :id
            ORDER BY
                F.ID_FORMULARIO`,
                [id]);

            const formulariosPermisos = [];
            for( let i = 0; i < consultapermisos.rows.length; i++ ){
                formulariosPermisos.push({
                    id_usuario: consultapermisos.rows[i][0],
                    id_perfil: consultapermisos.rows[i][1],
                    id_formulario: consultapermisos.rows[i][2],
                    nombre_formulario: consultapermisos.rows[i][3],
                    url_formulario: consultapermisos.rows[i][4],
                    crear_permiso: consultapermisos.rows[i][5],
                    consultar_permiso: consultapermisos.rows[i][6],
                    actualizar_permiso: consultapermisos.rows[i][7],
                    eliminar_permiso: consultapermisos.rows[i][8]   
                })}
            console.log(formulariosPermisos);
            
            
            
        // res.json(formulariosPermisos);
                
        console.log('Inicio de sesión exitoso');
        res.json({ status: 'success', message: 'Inicio de sesión exitoso', data: {usuario: usuario, permisos: formulariosPermisos} });

        } else {
            // Las credenciales no son válidas, el inicio de sesión falló
            res.json({ status: 'error', message: 'Credenciales no válidas' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }


});

router.get('/listaRoles', async (req, res) => {

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM ROLES`);

        const roles = result.rows.map(row => ({
            Id_rol: row[0],
            Nombre_rol: row[1]
        }));

        res.json(roles);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar roles:', error);
        res.status(500).json({ status: 'error' });
    }
});

router.post('/crearrol', async (req, res) => {
    console.log(req.body);
    const { id_nuevo_rol, nombre_nuevo_rol } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // const max_id = await conn.execute('SELECT NVL(MAX(ID_ROL), 0) + 1 AS nuevoId FROM ROLES');
        // const id_nuevo_rol = (max_id.length > 0) ? max_id[0].nuevoId : 1;

        //capturar los datos del formulario  ar los datos del formulario  
        const result = await conn.execute(`
            INSERT INTO ROLES (
                ID_ROL, 
                NOMBRE_ROL
            ) VALUES (
                ${id_nuevo_rol}, 
                '${nombre_nuevo_rol}'
        )`);
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Rol agregado con exito');
            res.status(200).json({ status: 'Correcto', message: 'Rol creado con exito' });

        } else {
            await conn.release();
        }


    } catch (error) {
        console.error('Error al registrar el rol:', error);
        res.status(500).json({ status: 'error', message: 'Error al registrar el rol en la base de datos', error: error.message });
    }
});

// Configura una ruta para manejar las solicitudes POST en '/editarrol'
router.post('/editarrol', async (req, res) => {
    const { id_rol, editar_nombre_rol } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la actualización en la base de datos
        const result = await conn.execute(`
            UPDATE ROLES
            SET NOMBRE_ROL = :editar_nombre_rol
            WHERE ID_ROL = :id_rol`,
            { editar_nombre_rol, id_rol },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Rol actualizado con éxito');
            res.json({ status: 'success', message: 'Rol actualizado con éxito' });
        } else {
            console.log('No se pudo actualizar el rol');
            res.status(500).json({ status: 'error', message: 'Error al actualizar el rol en la base de datos' });
        }
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Configura una ruta para manejar las solicitudes POST en '/eliminarrol'
router.post('/eliminarrol', async (req, res) => {
    const { id_rol } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la eliminación en la base de datos
        const result = await conn.execute(`
            DELETE FROM ROLES
            WHERE ID_ROL = :id_rol`,
            { id_rol },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Rol eliminado con éxito');
            res.json({ status: 'success', message: 'Rol eliminado con éxito' });
        } else {
            console.log('No se pudo eliminar el rol');
            res.status(500).json({ status: 'error', message: 'Error al eliminar el rol de la base de datos' });
        }
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/listaCategorias', async (req, res) => {

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM CATEGORIAS
        ORDER BY ID_CATEGORIA`);

        const categorias = result.rows.map(row => ({
            Id_categoria: row[0],
            Nombre_categoria: row[1]
        }));

        res.json(categorias);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar roles:', error);
        res.status(500).json({ status: 'error' });
    }
});

router.post('/crearCategoria', async (req, res) => {
    console.log(req.body);
    const { id_nueva_categoria, nombre_nueva_categoria } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario  
        const result = await conn.execute(`
            INSERT INTO CATEGORIAS (
                ID_CATEGORIA, 
                NOMBRE_CATEGORIA    
            ) VALUES (
                :id_nueva_categoria, 
                :nombre_nueva_categoria
            )`,
            { id_nueva_categoria, nombre_nueva_categoria }
        );
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Categoria agregada con exito');
            res.redirect('/')

        } else {
            await conn.release();
        }


    } catch (error) {
        console.error('Error al registrar el rol:', error);
        res.status(500).json({ status: 'error', message: 'Error al registrar el rol en la base de datos', error: error.message });
    }
});

// Configura una ruta para manejar las solicitudes POST en '/editarrol'
router.post('/editarCategoria', async (req, res) => {
    const { id_categoria, editar_nombre_categoria } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la actualización en la base de datos
        const result = await conn.execute(`
            UPDATE CATEGORIAS
            SET NOMBRE_CATEGORIA = :editar_nombre_categoria
            WHERE ID_CATEGORIA = :id_categoria`,
            { editar_nombre_categoria, id_categoria },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Categoria actualizada con éxito');
            res.json({ status: 'success', message: 'Categoria actualizada con éxito' });
        } else {
            console.log('No se pudo actualizar la categoria');
            res.status(500).json({ status: 'error', message: 'Error al actualizar la categoria en la base de datos' });
        }
    } catch (error) {
        console.error('Error al actualizar la categoria:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Configura una ruta para manejar las solicitudes POST en '/eliminarrol'
router.post('/eliminarCategoria', async (req, res) => {
    const { id_categoria } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la eliminación en la base de datos
        const result = await conn.execute(`
            DELETE FROM CATEGORIAS
            WHERE ID_CATEGORIA = :id_categoria`,
            { id_categoria },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Categoria eliminada con éxito');
            res.json({ status: 'success', message: 'Categoria eliminada con éxito' });
        } else {
            console.log('No se pudo eliminar la categoria');
            res.status(500).json({ status: 'error', message: 'Error al eliminar la categoria de la base de datos' });
        }
    } catch (error) {
        console.error('Error al eliminar la categoria:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/listarUsuarios', async (req, res) => {

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM USUARIOS`);

        const usuarios = result.rows.map(row => ({
            id_usuario: row[0],
            nombre_usuario: row[1],
            apellido1_usuario: row[2],
            apellido2_usuario: row[3],
            contacto_usuario: row[4],
            contrasena_usuario: row[5],
            id_perfil_usuario: row[6]
        }));

        res.json(usuarios);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar los usuarios:', error);
        res.status(500).json({ status: 'error' });
    }
});


router.get('/listaPerfiles', async (req, res) => {

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM PERFILES`);
        // SELECT 
        // perfiles.*, 
        // permisos.*
        // FROM 
        // perfiles
        // JOIN 
        // permisos ON perfiles.id_perfil = permisos.id_perfil

        const perfiles = result.rows.map(row => ({
            Id_perfil: row[0],
            Nombre_perfil: row[1],
            Id_rol: row[2]
        }));

        res.json(perfiles);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar perfiles:', error);
        res.status(500).json({ status: 'error' });
    }
});


router.post('/crearperfil', async (req, res) => {
    console.log(req.body);
    const { id_nuevo_perfil, nombre_nuevo_perfil, rol_nuevo_perfil } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario  
        const result = await conn.execute(`
            INSERT INTO PERFILES (
                ID_PERFIL, 
                NOMB_PERFIL,
                ID_ROL_PERFIL
            ) VALUES (:id_nuevo_perfil,:nombre_nuevo_perfil,:rol_nuevo_perfil)`,
            { id_nuevo_perfil, nombre_nuevo_perfil, rol_nuevo_perfil }

        );
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Perfil agregado con exito');
            res.status(200).json({ status: 'Correcto', message: 'Perfil agregado con éxito' });
        } else {
            await conn.release();
        }


    } catch (error) {
        console.error('Error al registrar el perfil:', error);
        res.status(500).json({ status: 'error', message: 'Error al registrar el perfil en la base de datos', error: error.message });
    }
});



router.post('/editarPerfil', async (req, res) => {
    const { id_nuevo_perfil, editar_nombre_perfil, editar_rol_perfil } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la actualización en la base de datos
        const result = await conn.execute(`
            UPDATE PERFILES
            SET NOMB_PERFIL = :editar_nombre_perfil,
                ID_ROL = :editar_rol_perfil
            WHERE ID_PERFIL = :id_nuevo_perfil`,
            { editar_nombre_perfil, editar_rol_perfil, id_nuevo_perfil },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Rol actualizado con éxito');
            res.json({ status: 'success', message: 'Rol actualizado con éxito' });
        } else {
            console.log('No se pudo actualizar el rol');
            res.status(500).json({ status: 'error', message: 'Error al actualizar el rol en la base de datos' });
        }
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/eliminarPerfil', async (req, res) => {
    const { id_nuevo_perfil } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la eliminación en la base de datos
        const result = await conn.execute(`
            DELETE FROM PERFILES
            WHERE ID_PERFIL = :id_nuevo_perfil`,
            { id_nuevo_perfil },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Perfil eliminado con éxito');
            res.json({ status: 'success', message: 'Categoria eliminada con éxito' });
        } else {
            console.log('No se pudo eliminar el perfil');
            res.status(500).json({ status: 'error', message: 'Error al eliminar el perfil de la base de datos' });
        }
    } catch (error) {
        console.error('Error al eliminar el perfil:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/listaFormularios', async (req, res) => {

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM FORMULARIOS
        ORDER BY ID_FORMULARIO`);

        const formularios = result.rows.map(row => ({
            Id_formulario: row[0],
            Nombre_formulario: row[1],
            Estado_formulario: row[2],
            Url_formulario: row[3]
        }));

        res.json(formularios);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar formularios:', error);
        res.status(500).json({ status: 'error' });
    }
});

router.post('/crearformulario', async (req, res) => {
    console.log(req.body);
    const { id_nuevo_formulario, vista_nuevo_formulario, estado_nuevo_formulario, url_nuevo_formulario } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario  
        const result = await conn.execute(`
            INSERT INTO FORMULARIOS (
                ID_FORMULARIO, 
                NOMBRE_FORMULARIO,
                ESTADO_FORMULARIO,
                URL_FORMULARIO
            ) VALUES (:id_nuevo_formulario,:vista_nuevo_formulario,:estado_nuevo_formulario, :url_nuevo_formulario)`,
            { id_nuevo_formulario, vista_nuevo_formulario, estado_nuevo_formulario, url_nuevo_formulario }

        );
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Formulario agregado con exito');

            res.status(200).json({ status: 'success', message: 'Formulario agregado con éxito' });
        } else {
            await conn.release();
        }


    } catch (error) {
        console.error('Error al registrar el formulario:', error);
        res.status(500).json({ status: 'error', message: 'Error al registrar el formulario en la base de datos', error: error.message });
    }
});

router.post('/editarFormulario', async (req, res) => {
    const { id_nuevo_formulario, editar_vista_formulario, editar_estado_formulario, editar_url_formulario } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la actualización en la base de datos
        const result = await conn.execute(`
            UPDATE FORMULARIOS
            SET NOMBRE_FORMULARIO = :editar_vista_formulario,
                ESTADO_FORMULARIO = :editar_estado_formulario,
                URL_FORMULARIO = :editar_url_formulario,
            WHERE ID_FORMULARIO = :id_nuevo_formulario`,
            { editar_vista_formulario, editar_estado_formulario, id_nuevo_formulario, editar_url_formulario },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Formulario actualizado con éxito');
            res.json({ status: 'success', message: 'Formulario actualizado con éxito' });
        } else {
            console.log('No se pudo actualizar el formulario');
            res.status(500).json({ status: 'error', message: 'Error al actualizar el formulario en la base de datos' });
        }
    } catch (error) {
        console.error('Error al actualizar el formulario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/eliminarFormulario', async (req, res) => {
    const { id_nuevo_formulario } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la eliminación en la base de datos
        const result = await conn.execute(`
            DELETE FROM FORMULARIOS
            WHERE ID_FORMULARIO = :id_nuevo_formulario`,
            { id_nuevo_formulario },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Formulario eliminado con éxito');
            res.json({ status: 'success', message: 'Formulario eliminado con éxito' });
        } else {
            console.log('No se pudo eliminar el formulario');
            res.status(500).json({ status: 'error', message: 'Error al eliminar el formulario de la base de datos' });
        }
    } catch (error) {
        console.error('Error al eliminar el formulario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/listarNovedades', async (req, res) => {

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM NOVEDADES
        ORDER BY ID_NOVEDAD`);

        const novedades = result.rows.map(row => ({
            Id_novedad: row[0],
            Nombre_novedad: row[1],
            Fecha_novedad: row[2],
            Hora_novedad: row[3],
            Lugar_novedad: row[4],
            Descripcion_novedad: row[5],
            Id_categoria: row[6],
        }));

        res.json(novedades);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar las novedades:', error);
        res.status(500).json({ status: 'error' });
    }
});

router.post('/crearNovedad', async (req, res) => {
    console.log(req.body);
    const { idNovedad, nombreNovedad, descripcionNovedad, fechaNovedad, horaNovedad, lugarNovedad, idCategoria , urlImagen } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario  
        const result = await conn.execute(`
            INSERT INTO NOVEDADES (
                ID_NOVEDAD,
                NOMBRE_NOVEDAD,
                DESCR_NOVEDAD,
                FECHA_NOVEDAD,
                HORA_NOVEDAD,
                LUGAR_NOVEDAD,
                ID_CATEGORIA,
                URL_IMAGEN
            ) VALUES (:idNovedad, :nombreNovedad, :descripcionNovedad, :fechaNovedad,:horaNovedad,:lugarNovedad,:idCategoria , :urlImagen)`,
            { idNovedad, nombreNovedad, descripcionNovedad, fechaNovedad, horaNovedad, lugarNovedad, idCategoria , urlImagen }

        );
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Novedad agregada con exito');
            res.json({ status: 'success', message: 'Novedad agregada con éxito' });
        } else {
            await conn.release();
        }


    } catch (error) {
        console.error('Error al registrar la novedad:', error);
        res.status(500).json({ status: 'error', message: 'Error al registrar la novedad en la base de datos', error: error.message });
    }
});


router.get('/listarEventUsers', async (req, res) => {
    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM NOVEDADES
        WHERE ID_CATEGORIA = 1`);

        const novedades = result.rows.map(row => ({
            // Id_novedad y Id_categoria no se incluyen en la respuesta
            Nombre_novedad: row[1],
            Fecha_novedad: row[2],
            Hora_novedad: row[3],
            Lugar_novedad: row[4],
            Descripcion_novedad: row[5],
            Url_imagen : row[6]
        }));

        // Adaptar el formato antes de enviar la respuesta
        const formattedNovedades = novedades.map(novedad => ({
            card: {
                //imgSrc: "...",  // Aquí deberías proporcionar la URL de la imagen correspondiente
                title: novedad.Nombre_novedad,
                description: novedad.Descripcion_novedad,
                date: novedad.Fecha_novedad,
                time: novedad.Hora_novedad,
                place: novedad.Lugar_novedad,
                image: novedad.Url_imagen
            }
        }));

        res.json(formattedNovedades);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar las novedades:', error);
        res.status(500).json({ status: 'error' });
    }
});

router.get('/listarNoticiasUsers', async (req, res) => {
    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM NOVEDADES
        WHERE ID_CATEGORIA = 2`);

        const novedades = result.rows.map(row => ({
            // Id_novedad y Id_categoria no se incluyen en la respuesta
            Nombre_novedad: row[1],
            Fecha_novedad: row[2],
            Hora_novedad: row[3],
            Lugar_novedad: row[4],
            Descripcion_novedad: row[5],
            Url_imagen : row[6]
        }));

        // Adaptar el formato antes de enviar la respuesta
        const formattedNovedades = novedades.map(novedad => ({
            card: {
                //imgSrc: "...",  // Aquí deberías proporcionar la URL de la imagen correspondiente
                title: novedad.Nombre_novedad,
                description: novedad.Descripcion_novedad,
                date: novedad.Fecha_novedad,
                time: novedad.Hora_novedad,
                place: novedad.Lugar_novedad,
                image: novedad.Url_imagen
            }
        }));

        res.json(formattedNovedades);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar las novedades:', error);
        res.status(500).json({ status: 'error' });
    }
});

router.post('/crearUsuario', async (req, res) => {
    console.log(req.body);
    const { id_nuevo_usuario, nombre_nuevo_usuario, apell1_nuevo_usuario, apell2_nuevo_usuario, nro_nuevo_usuario, contrasena_nuevo_usuario, perfil_nuevo_usuario } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario
        const result = await conn.execute(`
            INSERT INTO USUARIOS (
                ID_USUARIO,
                NOMBRE_USUARIO,
                P_APELL_USUARIO,
                S_APELL_USUARIO,
                NROCONT_USUARIO,
                CLAVE_USUARIO,
                ID_PERFIL
                ) VALUES (
                :id_nuevo_usuario,
                :nombre_nuevo_usuario,
                :apell1_nuevo_usuario,
                :apell2_nuevo_usuario,
                :nro_nuevo_usuario,
                :contrasena_nuevo_usuario,
                :perfil_nuevo_usuario)`,
            {
                id_nuevo_usuario,
                nombre_nuevo_usuario,
                apell1_nuevo_usuario,
                apell2_nuevo_usuario,
                nro_nuevo_usuario,
                contrasena_nuevo_usuario,
                perfil_nuevo_usuario
            }

        );
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Nuevo usuario agregado con exito');
            res.status(200).json({ status: 'Correcto', message: 'Usuario creado con exito' });

        } else {
            await conn.release();
            res.status(500).json('Error al guardar el usuario en la base de datos')
        }


    } catch (error) {
        console.error('Error al registrar el nuevo usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error al registrar el nuevo usuario en la base de datos', error: error.message });
    }
});

router.post('/editarUsuario', async (req, res) => {
    const { id_usuario, editar_nombre_usuario, editar_apell1_usuario, editar_apell2_usuario, editar_numero_usuario, editar_contrasena_usuario, editar_perfil_usuario } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la actualización en la base de datos
        const result = await conn.execute(`
            UPDATE USUARIOS
            SET ID_USUARIO = :id_usuario,
            NOMBRE_USUARIO = :editar_nombre_usuario,
            P_APELL_USUARIO = :editar_apell1_usuario,
            S_APELL_USUARIO = :editar_apell2_usuario,
            NROCONT_USUARIO = :editar_numero_usuario,
            CLAVE_USUARIO = :editar_contrasena_usuario,
            ID_PERFIL = :editar_perfil_usuario
            WHERE ID_USUARIO = :id_usuario`,
            { id_usuario, editar_nombre_usuario, editar_apell1_usuario, editar_apell2_usuario, editar_numero_usuario, editar_contrasena_usuario, editar_perfil_usuario },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Usuario editado con éxito');
            res.json({ status: 'success', message: 'Usuario editado con éxito' });
        } else {
            console.log('No se pudo editar el usuario');
            res.status(500).json({ status: 'error', message: 'Error al editar el usuario en la base de datos' });
        }
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/eliminarUsuario', async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Realiza la eliminación en la base de datos
        const result = await conn.execute(`
            DELETE FROM USUARIOS
            WHERE ID_USUARIO = :id_usuario`,
            { id_usuario },
            { autoCommit: true }
        );

        // Libera la conexión
        await conn.close();

        if (result.rowsAffected && result.rowsAffected >= 1) {
            console.log('Usuario eliminado con éxito');
            res.json({ status: 'success', message: 'Usuario eliminado con éxito' });
        } else {
            console.log('No se pudo eliminar el usuario');
            res.status(500).json({ status: 'error', message: 'Error al eliminar el usuario de la base de datos' });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/guardarPermisos', async (req, res) => {
    //console.log(req.body);
    const { permisos } = req.body;
    console.log('Datos recibidos en el servidor:', permisos); // Punto 1: Agregar este console.log para verificar si el servidor recibe correctamente los datos


    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario  

        const promises = permisos.map((formulario) => {
            try {
                console.log(`
            INSERT INTO PERMISOS (
                ID_FORMULARIO_PERMISO, 
                ID_PERFIL_PERMISO,
                CREAR_PERMISO,
                BUSCAR_PERMISO,
                ACTUALIZAR_PERMISO,
                ELIMINAR_PERMISO
            ) VALUES (${formulario.id_formulario},
                ${formulario.id_perfil},
                ${formulario.crear_permiso ? 1 : 0},
                ${formulario.consultar_permiso ? 1 : 0},
                ${formulario.actualizar_permiso ? 1 : 0},
                ${formulario.eliminar_permiso ? 1 : 0})`)
                return conn.execute(`
            INSERT INTO PERMISOS (
                ID_FORMULARIO_PERMISO, 
                ID_PERFIL_PERMISO,
                CREAR_PERMISO,
                BUSCAR_PERMISO,
                ACTUALIZAR_PERMISO,
                ELIMINAR_PERMISO
            ) VALUES (${formulario.id_formulario},
                ${formulario.id_perfil},
                ${formulario.crear_permiso ? 1 : 0},
                ${formulario.consultar_permiso ? 1 : 0},
                ${formulario.actualizar_permiso ? 1 : 0},
                ${formulario.eliminar_permiso ? 1 : 0})`

                );
            } catch (error) {
                console.error('Error al ejecutar la consulta:', error);
                throw error;
            }
        });
        try {
            await Promise.all(promises);
            await conn.commit(); // Agregar este commit
            await conn.close();
            res.status(200).send('Permisos guardados exitosamente');
        } catch (error) {
            console.error('Error al guardar permisos en la base de datos:', error);
            res.status(500).send('Error al guardar permisos en la base de datos');
        }
    } catch (error) {
        console.error('Error al obtener la conexión a la base de datos:', error);
        res.status(500).send('Error al obtener la conexión a la base de datos');
    }
});

router.get('/listarEventos', async (req, res) => {

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        // Consultar la base de datos para verificar las credenciales
        const result = await conn.execute(`SELECT * FROM NOVEDADES
        WHERE ID_NOVEDAD = 1`);

        const eventos = result.rows.map(row => ({
            Id_novedad: row[0],
            Nombre_novedad: row[1]
        }));

        res.json(eventos);

        await conn.close();
    } catch (error) {
        console.error('Error al consultar eventos:', error);
        res.status(500).json({ status: 'error' });
    }
});

router.post('/crearInscEvento', async (req, res) => {
    console.log(req.body);
    const { id_evento, id_usuario, id_novedad } = req.body;

    try {
        const pool = await db.conexion();
        const conn = await pool.getConnection();

        //capturar los datos del formulario  ar los datos del formulario  
        const result = await conn.execute(`
            INSERT INTO INSCR_EVENTOS_ USUARIOS (
                ID_EVENTO, 
                ID_USUARIO_INSCR,
                ID_NOVEDAD_INSCR
            ) VALUES (:id_evento,:id_usuario,:id_novedad)`,
            { id_evento, id_usuario, id_novedad }

        );
        if (result.rowsAffected && result.rowsAffected >= 1) {
            await conn.commit();
            await conn.release();
            console.log('Usuario registrado al evento con exito');
            res.status(200).json({ status: 'Correcto', message: 'Usuario registrado al evento con éxito' });
        } else {
            await conn.release();
        }


    } catch (error) {
        console.error('Error al registrar el usuario al evento:', error);
        res.status(500).json({ status: 'error', message: 'Error al registrar el usuario al evento en la base de datos', error: error.message });
    }
});
module.exports = router;