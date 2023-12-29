function mostrarContenido(categoria) {
    const contenido = document.querySelector('#seccion1 .contenido');
    switch (categoria) {
        case 'cmillanp':
            contenido.innerHTML = '<p>Información sobre mí...</p>';
            break;
        case 'experiencia':
            contenido.innerHTML = '<p>Detalles de mi experiencia...</p>';
            break;
        case 'habilidades':
            contenido.innerHTML = '<p>Descripción de mis habilidades...</p>';
            break;
        case 'proyectos':
            contenido.innerHTML = '<p>Algunos de mis proyectos destacados...</p>';
            break;
        // Más casos según sea necesario
    }
}

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



// Crear la escena
var scene = new THREE.Scene();

// Crear la cámara
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Crear el renderizador
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear una geometría
var geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
var material = new THREE.MeshNormalMaterial();
var torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Animación
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Llamada a la función de animación
animate();

// Ajustar el renderizado al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
