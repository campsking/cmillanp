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

function abrirEnPantallaCompleta() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

function mostrarPrototipo(prototipoId) {
    // Ocultar todos los prototipos
    document.querySelectorAll('.seccion .prototipo').forEach(prototipo => {
        prototipo.style.display = 'none';
    });

    // Mostrar el prototipo seleccionado
    document.getElementById(prototipoId).style.display = 'block';
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const extraInfo = card.querySelector('.extra-info');
        if (extraInfo.style.display === 'none') {
            extraInfo.style.display = 'block';
        } else {
            extraInfo.style.display = 'none';
        }
    });
});

