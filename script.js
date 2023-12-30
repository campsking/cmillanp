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

function togglePrototipo() {
    var protoContainer = document.querySelector('.btn_proto');
    var toggleButton = document.getElementById('botonMostrarProto');

    if (protoContainer.style.display === 'none' || protoContainer.style.display === '') {
        protoContainer.classList.add('boton-mostrar');
        protoContainer.style.display = 'flex';
        toggleButton.classList.add('boton-ocultar');
        setTimeout(function() {
            toggleButton.style.display = 'none';
        }, 500); // Coincide con la duración de la animación
    } else {
        toggleButton.classList.remove('boton-ocultar');
        toggleButton.style.display = 'block';
        toggleButton.classList.add('boton-mostrar');
        protoContainer.classList.add('boton-ocultar');
        setTimeout(function() {
            protoContainer.style.display = 'none';
            protoContainer.classList.remove('boton-mostrar');
            protoContainer.classList.remove('boton-ocultar');
        }, 500); // Coincide con la duración de la animación
    }
}

function mostrarPrototipo(prototipoId) {
    // Ocultar todos los prototipos
    document.querySelectorAll('.seccion .prototipo').forEach(prototipo => {
        prototipo.style.display = 'none'; 
    });

    // Mostrar el prototipo seleccionado
    document.getElementById(prototipoId).style.display = 'block';

    // Ocultar los botones de prototipo y mostrar el botón pequeño
    document.querySelector('.btn_proto').style.display = 'none';
    document.getElementById('botonMostrarProto').style.display = 'block';
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

