// Captura el evento de envío del formulario
document.getElementById('eventoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtiene los valores de los campos
    var imagen = document.getElementById('imagen').value;
    var descripcion = document.getElementById('descripcion').value;
    var fecha = document.getElementById('fecha').value;
    var hora = document.getElementById('hora').value;
    var lugar = document.getElementById('lugar').value;

    // Aquí puedes hacer lo que desees con los valores, por ejemplo, enviarlos a un servidor o mostrarlos en la página.
    console.log('Imagen:', imagen);
    console.log('Descripción:', descripcion);
    console.log('Fecha:', fecha);
    console.log('Hora:', hora);
    console.log('Lugar:', lugar);

    // Reinicia el formulario después de procesar los valores (esto es opcional)
    document.getElementById('eventoForm').reset();
});