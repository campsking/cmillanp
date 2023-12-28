let secciones = document.querySelectorAll('.seccion');
let indiceSeccionActual = 0;

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

// Evento de desplazamiento del ratón (scroll)
window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        cambiarSeccionActiva(indiceSeccionActual + 1);
    } else {
        cambiarSeccionActiva(indiceSeccionActual - 1);
    }
});

// Eventos de desplazamiento táctil (touch)
let startY = 0;
window.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
}, false);

window.addEventListener('touchend', (event) => {
    let endY = event.changedTouches[0].clientY;
    if (endY > startY) {
        cambiarSeccionActiva(indiceSeccionActual - 1);
    } else {
        cambiarSeccionActiva(indiceSeccionActual + 1);
    }
}, false);

// Agregar eventos táctiles para la galería
const galeria = document.querySelector('.galeria');
galeria.addEventListener('touchstart', handleTouchStart, { passive: false });
galeria.addEventListener('touchmove', handleTouchMove, { passive: false });
galeria.addEventListener('touchend', handleTouchEnd, { passive: false });

// Funciones para manejar el desplazamiento táctil en la galería
function handleTouchStart(e) {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    let deltaX = e.touches[0].pageX - startX;
    let deltaY = e.touches[0].pageY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault(); // Previene el desplazamiento vertical solo cuando es un arrastre horizontal
        // Código para manejar el arrastre horizontal...
    }
}

function handleTouchEnd() {
    isDragging = false;
}
