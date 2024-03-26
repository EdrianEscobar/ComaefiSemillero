let permisos;
let usuario;

(() => {

    const elUserName = document.getElementById('userName');
    const eleMenu = document.getElementById('menu');
    permisos = localStorage.getItem('permisos');
    usuario = localStorage.getItem('usuario');

    permisos = atob(permisos);
    permisos = JSON.parse(permisos);

    usuario = atob(usuario);
    usuario = JSON.parse(usuario);

    if (usuario && usuario.length) {
        elUserName.text = usuario[3];
    }

    for (const item of permisos) {

        if (!item.consultar_permiso) continue;

        const li = document.createElement('li')
        li.classList.add('nav-item');

        const a = document.createElement('a');
        a.classList.add('nav-link');
        a.href = item.url_formulario;
        a.text = item.nombre_formulario;

        li.appendChild(a);
        eleMenu.appendChild(li);
    }
    if (fomrId === - 1) return;

    const permiso = permisos.find(o => o.id_formulario == fomrId);

    const btnCrear = document.getElementById('btnCrear');
    if (permiso?.crear_permiso === 0 && btnCrear) {
        btnCrear.style.display = 'none';
    }

    const btnConsultar = document.getElementById('btnConsultar');
    if (permiso?.consultar_permiso === 0 && btnConsultar) {
        btnConsultar.style.display = 'none';
    }

    const btnEditar = document.getElementById('btnEditar');
    if (permiso?.actualizar_permiso === 0 && btnEditar) {
        btnEditar.style.display = 'none';
    }

    const btnEliminar = document.getElementById('btnEliminar');
    if (permiso?.eliminar_permiso === 0 && btnEliminar) {
        btnEliminar.style.display = 'none';
    }

    if (permiso?.consultar_permiso === 0) {
        window.location = "/semillero/admin/home.html";
    }
    
})();

//Categorias
function crearCategoria(e) {
    e.preventDefault();
    const id_nueva_categoria = document.getElementById('registro_id_categoria').value;
    const nombre_nueva_categoria = document.getElementById('registro_nombre_categoria').value;

    // Crear un objeto con los datos a enviar al servidor
    const userData = {
        id_nueva_categoria: id_nueva_categoria,
        nombre_nueva_categoria: nombre_nueva_categoria,
    };

    // Enviar los datos al servidor Node.js (usando fetch o XMLHttpRequest) se agrego /registrar para direccionar a la ruta
    fetch('http://localhost:3000/crearCategoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === 'success') {
                alert('Categoria agregada con éxito');
                // Redirecciona o realiza otras acciones de éxito aquí
                //document.getElementById('formularioRoles').reset();
            } else {
                alert('Error al ingresar el usuario');
                // Realiza acciones de error aquí si es necesario
            }
        }).catch(error => {
            console.error(error);

        });
}

function editarCategoria(e) {
    e.preventDefault();

    // Obtén los valores del formulario
    const id_categoria = document.getElementById('registro_id_categoria').value;
    const editar_nombre_categoria = document.getElementById('registro_nombre_categoria').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_categoria, editar_nombre_categoria };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/editarCategoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

function eliminarCategoria(e) {
    e.preventDefault();

    // Obtén el valor del formulario
    const id_categoria = document.getElementById('registro_id_categoria').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_categoria };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/eliminarCategoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

// Roles
function crearRol(e) {
    e.preventDefault();
    const id_nuevo_rol = document.getElementById('registro_id_rol').value;
    const nombre_nuevo_rol = document.getElementById('registro_nombre_rol').value;


    // Crear un objeto con los datos a enviar al servidor
    const userData = {
        id_nuevo_rol: id_nuevo_rol,
        nombre_nuevo_rol: nombre_nuevo_rol,
    };

    // Enviar los datos al servidor Node.js (usando fetch o XMLHttpRequest) se agrego /registrar para direccionar a la ruta
    fetch('http://localhost:3000/crearrol', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(userData => {

            console.log(userData);
            if (userData.status === 'Correcto') {
                alert('Rol ingresado con éxito');
                document.getElementById('registro_id_rol').value = '';
                document.getElementById('registro_nombre_rol').value = '';
                listarRoles(e);
            } else {
                alert('Error al ingresar el usuario');
            }
        }).catch(error => {
            console.error(error);

        });
}

function editarRol(e) {
    e.preventDefault();

    // Obtén los valores del formulario
    const id_rol = document.getElementById('registro_id_rol').value;
    const editar_nombre_rol = document.getElementById('registro_nombre_rol').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_rol, editar_nombre_rol };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/editarrol', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            alert('Rol editado con éxito');
            document.getElementById('registro_id_rol').value = '';
            document.getElementById('registro_nombre_rol').value = '';
            console.log(result);
            listarRoles(e);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

function eliminarRol(e) {
    e.preventDefault();

    // Obtén el valor del formulario
    const id_rol = document.getElementById('registro_id_rol').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_rol };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/eliminarrol', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert('Rol eliminado con éxito');
            document.getElementById('registro_id_rol').value = '';
            listarRoles(e);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

// Formulario
function crearFormulario(e) {
    e.preventDefault();
    const id_nuevo_formulario = document.getElementById('registro_id_formulario').value;
    const vista_nuevo_formulario = document.getElementById('registro_nombre_vista').value;
    const estado_nuevo_formulario = document.getElementById('registro_estado_formulario').value;
    const url_nuevo_formulario = document.getElementById('registro_url_formulario').value;

    // Crear un objeto con los datos a enviar al servidor
    const userData = {
        id_nuevo_formulario: id_nuevo_formulario,
        vista_nuevo_formulario: vista_nuevo_formulario,
        estado_nuevo_formulario: estado_nuevo_formulario,
        url_nuevo_formulario: url_nuevo_formulario
    };

    // Enviar los datos al servidor Node.js (usando fetch o XMLHttpRequest) se agrego /registrar para direccionar a la ruta
    fetch('http://localhost:3000/crearformulario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === 'success') {
                alert('Formulario ingresado con éxito');
                // Redirecciona o realiza otras acciones de éxito aquí

            } else {
                alert('Error al ingresar el formulario');
                // Realiza acciones de error aquí si es necesario
            }
        }).catch(error => {
            console.error(error);

        });
}

function editarFormulario(e) {
    e.preventDefault();

    // Obtén los valores del formulario
    const id_nuevo_formulario = document.getElementById('registro_id_formulario').value;
    const editar_vista_formulario = document.getElementById('registro_nombre_vista').value;
    const editar_estado_formulario = document.getElementById('registro_estado_formulario').value;
    const editar_url_formulario = document.getElementById('registro_url_formulario').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_nuevo_formulario, editar_vista_formulario, editar_estado_formulario, editar_url_formulario };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/editarFormulario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert('Formulario editado con éxito');
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            alert('Error al editar el formulario');
            // Manejo de errores
        });
}

function eliminarFormulario(e) {
    e.preventDefault();

    // Obtén el valor del formulario
    const id_nuevo_formulario = document.getElementById('registro_id_formulario').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_nuevo_formulario };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/eliminarFormulario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert('Formulario eliminado con éxito');
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            alert('Error al eliminar el formulario');
            // Manejo de errores
        });
}

//Novedades
function crearEvento(e) {
    e.preventDefault();

    const idNovedad = document.getElementById('idNovedad').value;
    const nombreNovedad = document.getElementById('nombreNovedad').value;
    const fechaNovedad = document.getElementById('fechaNovedad').value;
    const horaNovedad = document.getElementById('horaNovedad').value;
    const lugarNovedad = document.getElementById('lugarNovedad').value;
    const descripcionNovedad = document.getElementById('descripcionNovedad').value;
    const idCategoria = document.getElementById('selectCategorias').value;
    const urlImagen = document.getElementById('imagen').value;

    console.log(urlImagen);

    // Crear un objeto con los datos a enviar al servidor
    const formData = {
    idNovedad : idNovedad,
    nombreNovedad : nombreNovedad,
    fechaNovedad : fechaNovedad,
    horaNovedad : horaNovedad,
    lugarNovedad : lugarNovedad,
    descripcionNovedad : descripcionNovedad,
    idCategoria : idCategoria,
    urlImagen : urlImagen

    };

    // Enviar los datos al servidor Node.js (usando fetch o XMLHttpRequest) se agrego /registrar para direccionar a la ruta
    fetch('http://localhost:3000/crearNovedad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(formData => {
            console.log(formData);
            if (formData.status === 'success') {
                alert('Novedad creada con éxito');
                listarNovedades(e);
                // Redirecciona o realiza otras acciones de éxito aquí
                //document.getElementById('formularioRoles').reset();
            } else {
                alert('Error al crear novedad');
                // Realiza acciones de error aquí si es necesario
            }
        }).catch(error => {
            console.error(error);

        });
}


function editarEvento(e) {
    e.preventDefault();

    // Obtén los valores del formulario
    const idNovedad = document.getElementById('idNovedad').value;
    const editar_nombre_nov = document.getElementById('nombreNovedad').value;
    const editar_fecha_nov = document.getElementById('fechaNovedad').value;
    const editar_hora_nov = document.getElementById('horaNovedad').value;
    const editar_lugar_nov = document.getElementById('lugarNovedad').value;
    const editar_descripcion_nov = document.getElementById('descripcionNovedad').value;
    const editar_id_categoria = document.getElementById('selectCategorias').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { idNovedad, editar_nombre_nov, editar_fecha_nov, editar_hora_nov, editar_lugar_nov, editar_descripcion_nov, editar_id_categoria };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/editarNovedad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // listarRolesEditados();
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

function eliminarEvento(e) {
    e.preventDefault();

    // Obtén el valor del formulario
    const idNovedad = document.getElementById('idNovedad').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { idNovedad };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/eliminarNovedad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

//Perfiles 1
function guardarPermisos(e) {
    e.preventDefault();

    const id_perfil = document.getElementById('selectPermisosPerfil').value;
    const apiUrl = 'http://localhost:3000/listaFormularios';

    fetch(apiUrl)
        .then(response => response.json())
        .then(formularios => {
            console.log(formularios);
            const formulariodb = [];
            formularios.forEach(item => {
                const id_formulario = item.Id_formulario;
                const nombre_formulario = item.Nombre_formulario;
                const crear_permiso = document.getElementById(`${item.Nombre_formulario}+(crear)`).checked;
                const consultar_permiso = document.getElementById(`${item.Nombre_formulario}+(consultar)`).checked;
                const eliminar_permiso = document.getElementById(`${item.Nombre_formulario}+(eliminar)`).checked;
                const actualizar_permiso = document.getElementById(`${item.Nombre_formulario}+(actualizar)`).checked;

                formulariodb.push({
                    id_formulario: id_formulario,
                    id_perfil: id_perfil,
                    crear_permiso: crear_permiso,
                    consultar_permiso: consultar_permiso,
                    actualizar_permiso: actualizar_permiso,
                    eliminar_permiso: eliminar_permiso
                })
            });

            console.log(formulariodb);

            const apiUrl = 'http://localhost:3000/guardarPermisos'
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ permisos: formulariodb })
            }).then(response => {
                if (response.ok) {
                    console.log('Permisos guardados exitosamente');
                    window.alert('Permisos guardados exitosamente.');
                    // Recargar la página después de un guardado exitoso
                    window.location.reload();
                } else {
                    console.error('Error al intentar guardar permisos:', response.statusText);
                }
            })
        })
        .catch(error => console.error('Error:', error));
}

function crearperfil(e) {
    e.preventDefault();
    const id_nuevo_perfil = document.getElementById('registro_id_perfil').value;
    const nombre_nuevo_perfil = document.getElementById('registro_nombre_perfil').value;
    const rol_nuevo_perfil = document.getElementById('selectRolPerfil').value;

    // Crear un objeto con los datos a enviar al servidor
    const userData = {
        id_nuevo_perfil: id_nuevo_perfil,
        nombre_nuevo_perfil: nombre_nuevo_perfil,
        rol_nuevo_perfil: rol_nuevo_perfil
    };

    // Enviar los datos al servidor Node.js (usando fetch o XMLHttpRequest) se agrego /registrar para direccionar a la ruta
    fetch('http://localhost:3000/crearperfil', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {

            console.log(data);
            if (data.status === 'Correcto') {
                alert('Perfil ingresado con éxito');
                document.getElementById('registro_id_perfil').value = '';
                document.getElementById('registro_nombre_perfil').value = '';
                document.getElementById('selectRolPerfil').value = '';
                listarPerfiles(e);
                // Redirecciona o realiza otras acciones de éxito aquí
                //document.getElementById('formularioRoles').reset();
            } else {
                alert('Error al ingresar el perfil');
                // Realiza acciones de error aquí si es necesario
            }
        }).catch(error => {
            console.error(error);

        });
}

function editarPerfil(e) {
    e.preventDefault();

    // Obtén los valores del formulario
    const id_nuevo_perfil = document.getElementById('registro_id_perfil').value;
    const editar_nombre_perfil = document.getElementById('registro_nombre_perfil').value;
    const editar_rol_perfil = document.getElementById('selectRolPerfil').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_nuevo_perfil, editar_nombre_perfil, editar_rol_perfil };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/editarPerfil', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

function eliminarPerfil(e) {
    e.preventDefault();

    // Obtén el valor del formulario
    const id_nuevo_perfil = document.getElementById('registro_id_perfil').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_nuevo_perfil };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/eliminarPerfil', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

// Usuario
function crearUsuario(e) {
    e.preventDefault();
    const id_nuevo_usuario = document.getElementById('registro_id_usuario').value;
    const nombre_nuevo_usuario = document.getElementById('registro_nombres_usuario').value;
    const apell1_nuevo_usuario = document.getElementById('registro_apellidos1_usuario').value;
    const apell2_nuevo_usuario = document.getElementById('registro_apellidos2_usuario').value;
    const nro_nuevo_usuario = document.getElementById('registro_numero_usuario').value;
    const contrasena_nuevo_usuario = document.getElementById('registro_contrasena_usuario').value;
    const perfil_nuevo_usuario = document.getElementById('selectPerfilUsuario').value;

    // Crear un objeto con los datos a enviar al servidor
    const userData = {
        id_nuevo_usuario: id_nuevo_usuario,
        nombre_nuevo_usuario: nombre_nuevo_usuario,
        apell1_nuevo_usuario: apell1_nuevo_usuario,
        apell2_nuevo_usuario: apell2_nuevo_usuario,
        nro_nuevo_usuario: nro_nuevo_usuario,
        contrasena_nuevo_usuario: contrasena_nuevo_usuario,
        perfil_nuevo_usuario: perfil_nuevo_usuario,
    };

    // Enviar los datos al servidor Node.js (usando fetch o XMLHttpRequest) se agrego /registrar para direccionar a la ruta
    fetch('http://localhost:3000/crearUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(userData => {
            console.log(userData);
            if (userData.status === 'Correcto') {
                alert('Usuario ingresado con éxito');
                document.getElementById('registro_id_usuario').value = '';
                document.getElementById('registro_nombres_usuario').value = '';
                document.getElementById('registro_apellidos1_usuario').value = '';
                document.getElementById('registro_apellidos2_usuario').value = '';
                document.getElementById('registro_numero_usuario').value = '';
                document.getElementById('registro_contrasena_usuario').value = '';
                document.getElementById('selectPerfilUsuario').value = '';
                listarUsuarios(e);
            } else {
                alert('Error al ingresar el usuario');
                // Realiza acciones de error aquí si es necesario
            }
        }).catch(error => {
            console.error(error);

        });
}

function editarUsuario(e) {
    e.preventDefault();

    const id_usuario = document.getElementById('registro_id_usuario').value;
    const editar_nombre_usuario = document.getElementById('registro_nombres_usuario').value;
    const editar_apell1_usuario = document.getElementById('registro_apellidos1_usuario').value;
    const editar_apell2_usuario = document.getElementById('registro_apellidos2_usuario').value;
    const editar_numero_usuario = document.getElementById('registro_numero_usuario').value;
    const editar_contrasena_usuario = document.getElementById('registro_contrasena_usuario').value;
    const editar_perfil_usuario = document.getElementById('selectPerfilUsuario').value;

    // Crear un objeto con los datos a enviar al servidor
    const userData = {
        id_usuario: id_usuario,
        editar_nombre_usuario: editar_nombre_usuario,
        editar_apell1_usuario: editar_apell1_usuario,
        editar_apell2_usuario: editar_apell2_usuario,
        editar_numero_usuario: editar_numero_usuario,
        editar_contrasena_usuario: editar_contrasena_usuario,
        editar_perfil_usuario: editar_perfil_usuario,
    };


    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/editarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert('Usuario editado con éxito');
            document.getElementById('registro_id_usuario').value = '';
            document.getElementById('registro_nombres_usuario').value = '';
            document.getElementById('registro_apellidos1_usuario').value = '';
            document.getElementById('registro_apellidos2_usuario').value = '';
            document.getElementById('registro_numero_usuario').value = '';
            document.getElementById('registro_contrasena_usuario').value = '';
            document.getElementById('selectPerfilUsuario').value = '';
            listarUsuarios(e);
            // Realiza acciones adicionales según la respuesta del servidor
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

function eliminarUsuario(e) {
    e.preventDefault();

    // Obtén el valor del formulario
    const id_usuario = document.getElementById('registro_id_usuario').value;

    // Crea un objeto con los datos a enviar al servidor
    const data = { id_usuario };

    // Enviar los datos al servidor usando fetch
    fetch('http://localhost:3000/eliminarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert('Usuario eliminado con éxito');
            document.getElementById('registro_id_usuario').value = '';
            document.getElementById('registro_nombres_usuario').value = '';
            document.getElementById('registro_apellidos1_usuario').value = '';
            document.getElementById('registro_apellidos2_usuario').value = '';
            document.getElementById('registro_numero_usuario').value = '';
            document.getElementById('registro_contrasena_usuario').value = '';
            document.getElementById('selectPerfilUsuario').value = '';
            listarUsuarios(e);
        })
        .catch(error => {
            console.error(error);
            // Manejo de errores
        });
}

function RegistroEvento(e) {
    e.preventDefault();
    const id_usuario = document.getElementById('registro_nombre_perfil').value;
    const id_novedad = document.getElementById('selectEventos').value;
    const a = localStorage.getItem(usuario[0])

    // Crear un objeto con los datos a enviar al servidor
    const userData = {
        id_usuario: id_usuario,
        id_novedad: id_novedad,
    };

    // Enviar los datos al servidor Node.js (usando fetch o XMLHttpRequest) se agrego /registrar para direccionar a la ruta
    fetch('http://localhost:3000/crearInscEvento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {

            console.log(data);
            if (data.status === 'Correcto') {
                alert('Perfil ingresado con éxito');
                //document.getElementById('registro_id_perfil').value = '';
                //document.getElementById('registro_nombre_perfil').value = '';
                //document.getElementById('selectRolPerfil').value = '';
                //listarPerfiles(e);
                // Redirecciona o realiza otras acciones de éxito aquí
                //document.getElementById('formularioRoles').reset();
            } else {
                alert('Error al ingresar el perfil');
                // Realiza acciones de error aquí si es necesario
            }
        }).catch(error => {
            console.error(error);

        });
}