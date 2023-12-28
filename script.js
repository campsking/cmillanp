let secciones = document.querySelectorAll('.seccion');
let indiceSeccionActual = 0;
let startX, startY, isDragging = false;
const umbralVertical = 50; // Ajusta este valor para controlar la sensibilidad del desplazamiento vertical

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

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Desplazamiento horizontal en la galería
        if (event.target.closest('.galeria')) {
            event.preventDefault(); // Prevenir el desplazamiento vertical
            // Código para manejar el arrastre horizontal...
        }
    } else if (Math.abs(deltaY) > umbralVertical) {
        // Desplazamiento vertical: cambiar de sección
        cambiarSeccionActiva(deltaY > 0 ? indiceSeccionActual - 1 : indiceSeccionActual + 1);
    }
}, false);

window.addEventListener('touchend', () => {
    isDragging = false;
}, false);

// Agregar eventos para arrastre en la galería en PC
const galeria = document.querySelector('.galeria');
galeria.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - galeria.offsetLeft;
    scrollLeft = galeria.scrollLeft;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

galeria.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - galeria.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicador de velocidad de arrastre
    galeria.scrollLeft = scrollLeft - walk;
});
