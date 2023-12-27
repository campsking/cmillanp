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

const galeria = document.querySelector('.galeria');

galeria.addEventListener('scroll', () => {
    // Si el usuario está cerca del final de la galería, carga más imágenes
    if (galeria.scrollWidth - galeria.scrollLeft === galeria.clientWidth) {
        // Aquí va el código para añadir más imágenes a la galería
        cargarMasImagenes(); // Esta es una función que deberás definir
    }
});

function cargarMasImagenes() {
    // Aquí deberías agregar más elementos de galería (`.elemento-galeria`)
    // Puedes hacerlo creando nuevos elementos DOM y agregándolos a la galería
}
// Agregar funcionalidad de arrastre a la galería
let isDragging = false;
let startPos = 0;
let scrollLeft;

galeria.addEventListener('mousedown', (e) => {
    isDragging = true;
    galeria.classList.add('active');
    startPos = e.pageX - galeria.offsetLeft;
    scrollLeft = galeria.scrollLeft;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    galeria.classList.remove('active');
});

galeria.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - galeria.offsetLeft;
    const walk = (x - startPos) * 2; // Multiplicador de velocidad de arrastre
    galeria.scrollLeft = scrollLeft - walk;
});

// Mantener eventos de desplazamiento táctil (touch) existentes
// ... Tu código existente de desplazamiento táctil ...