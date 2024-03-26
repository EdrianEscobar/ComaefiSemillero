function loguear()
{
var user= document.getElementById("id_usuario").value;
var pass= document.getElementById("contrasena").value;


fetch('http://localhost:3000/login', {
    method: "POST",
    body: JSON.stringify({ usuario: user, pass: pass }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    
  
  then((response) => response.json())
    .then((data) => {
      if (data.valido) {
        if (data.esAdmin) {
          window.location = "/semillero/admin/principalAdmin.html";
        } else {
          window.location = "/semillero/usuario/principalusuario.html";
        }
      } else {
        alert("Ingrese los datos correctos");
      }
    })
    .catch((error) => {
      console.error("Error al iniciar sesión: " + error);
    });
}

