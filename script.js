let secciones = document.querySelectorAll('.seccion');
let indiceSeccionActual = 0;
let startX, startY, isDragging = false;
const umbral = 10; // Umbral para diferenciar entre desplazamiento vertical y horizontal

// Función para cambiar la sección activa
function cambiarSeccionActiva(nuevoIndice) {
    if (nuevoIndice >= 0 && nuevoIndice < secciones.length) {
        secciones.forEach(seccion => seccion.classList.remove('activa'));
        secciones[nuevoIndice].classList.add('activa');
        indiceSeccionActual = nuevoIndice;
    }
}

// Evento de clic para cambiar secciones
secciones.forEach((seccion, indice) => {
    seccion.addEventListener('click', () => cambiarSeccionActiva(indice));
});

// Eventos de desplazamiento táctil
window.addEventListener('touchstart', (event) => {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
    isDragging = true;
}, false);

window.addEventListener('touchmove', (event) => {
    if (!isDragging) return;
    let deltaX = event.touches[0].pageX - startX;
    let deltaY = event.touches[0].pageY - startY;

    // Verificar si el desplazamiento es principalmente horizontal o vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > umbral) {
        // Desplazamiento horizontal: manejar la galería
        if (event.target.closest('.galeria')) {
            event.preventDefault(); // Prevenir el desplazamiento vertical
            // Aquí tu lógica para desplazar horizontalmente la galería
        }
    } else if (Math.abs(deltaY) > umbral) {
        // Desplazamiento vertical: manejar el cambio de sección
        cambiarSeccionActiva(deltaY > 0 ? indiceSeccionActual - 1 : indiceSeccionActual + 1);
    }
}, false);

window.addEventListener('touchend', () => {
    isDragging = false;
}, false);

// Resto de tu lógica para la galería...
