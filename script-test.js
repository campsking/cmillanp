const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / (window.innerHeight * 0.6), 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight * 0.6); // Cambiar aquí para el alto
document.body.appendChild(renderer.domElement);

// Manejador de eventos para ajustar el tamaño cuando se cambia el tamaño de la ventana
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.6);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
}

// Agregar Luz Ambiental y Direccional
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);


// Crear un icosaedro visible y añadirlo a la escena
const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 0);
const icosahedronMaterial = new THREE.MeshBasicMaterial({ color: 0x1f1f1f, wireframe: true });
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
scene.add(icosahedron);

// Asignar una velocidad de rotación visible al icosaedro
icosahedron.userData.rotationSpeed = new THREE.Vector3(
    0.0006, // X axis
    0.0006, // Y axis
    0.0006  // Z axis
);

const positionAttribute = icosahedronGeometry.attributes.position;
// Usar una variable diferente para la geometría del mini icosaedro
const miniIcosahedronGeometry = new THREE.IcosahedronGeometry(0.7, 0); // Definir la geometría del icosaedro
const createdPositions = []; // Almacenar las posiciones creadas

for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);

    // Verificar si ya se creó un icosaedro en esta posición
    if (!createdPositions.some(pos => pos.equals(vertex))) {
        const icosahedronMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const miniIcosahedron = new THREE.Mesh(miniIcosahedronGeometry, icosahedronMaterial);

        // Aplicar una posición inicial desplazada en función del índice
        miniIcosahedron.position.copy(vertex).multiplyScalar(1.1);

        // Agregar el mini icosaedro como hijo del icosaedro original
        icosahedron.add(miniIcosahedron);

        // Almacenar la posición creada
        createdPositions.push(vertex);

        // Agregar una velocidad de rotación a cada mini icosaedro
        miniIcosahedron.userData.rotationSpeed = new THREE.Vector3(
            Math.random() * 0.01 - 0.006, // Rotación en el eje X
            Math.random() * 0.01 - 0.006, // Rotación en el eje Y
            Math.random() * 0.01 - 0.006  // Rotación en el eje Z
        );
        // Paso 1: Agregar un indicador para rastrear si el mini icosaedro ha sido clickeado
        miniIcosahedron.userData.clicked = false;
    }
}

// Estilo de los icosaedros
icosahedron.children.forEach(miniIcosahedron => {
    miniIcosahedron.visible = true; // Asegurarse de que el icosaedro esté visible
});

// Paso 2: Configurar el controlador de eventos de clic
function onDocumentMouseDown(event) {
    event.preventDefault();

    // Calcular la posición del ratón en coordenadas normalizadas (-1 a +1)
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    // Actualizar el raycaster con la posición del ratón
    raycaster.setFromCamera(mouse, camera);

    // Calcular objetos intersectados
    const intersects = raycaster.intersectObjects(icosahedron.children);

    // Cambiar el color del primer objeto intersectado
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (!object.userData.clicked) {
            object.material.color.set(0xFF6600); // Color naranja
            object.userData.clicked = true;
        } else {
            object.material.color.set(0xffffff); // Color original
            object.userData.clicked = false;
        }
    }
}

// Función para comprobar si todos los mini icosaedros son naranjas
function allIcosahedronsAreOrange() {
    return icosahedron.children.every(miniIcosahedron =>
        miniIcosahedron.material.color.equals(new THREE.Color(0xFF6600))
    );
}

// Función para reiniciar los colores de los mini icosaedros
function resetMiniIcosahedronsColor() {
    icosahedron.children.forEach(miniIcosahedron => {
        miniIcosahedron.material.color.set(0xffffff); // Color por defecto
        miniIcosahedron.userData.clicked = false;
    });
}

// Agregar el controlador de eventos de clic al documento
document.addEventListener('mousedown', onDocumentMouseDown, false);



// Raycaster para interacción
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Variables globales para controlar la animación
let isAnimating = false;
let rotationSpeed = { x: 0.005, y: 0.005 }; // Velocidad normal de rotación
let maxRotationSpeed = { x: 0.1, y: 0.1 }; // Velocidad máxima para la animación rápida

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Comprobar si todos los mini icosaedros son naranjas
    if (allIcosahedronsAreOrange()) {
        // Aumentar la velocidad de rotación para el efecto de giro rápido
        icosahedron.rotation.x += 0.1;
        icosahedron.rotation.y += 0.1;

        // Puedes usar un temporizador o una condición para determinar cuándo detener el giro y reiniciar los colores
        setTimeout(() => {
            resetMiniIcosahedronsColor();
            // Restablecer la rotación normal del icosaedro grid aquí si es necesario
        }, 1000); // Ajusta este tiempo según la duración deseada del giro
    }

    // Rotación del icosaedro basado en su velocidad de rotación
    icosahedron.rotation.x += icosahedron.userData.rotationSpeed.x;
    icosahedron.rotation.y += icosahedron.userData.rotationSpeed.y;
    icosahedron.rotation.z += icosahedron.userData.rotationSpeed.z;

    // Rotación de los cubos individuales
    icosahedron.children.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;
    });

    renderer.render(scene, camera);
}

animate();

// Evento para iniciar el arrastre
renderer.domElement.addEventListener('mousedown', event => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// Evento para detener el arrastre
renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

// Evento para el arrastre en sí
renderer.domElement.addEventListener('mousemove', event => {
    if (!isDragging) return;

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    const rotationSpeed = 0.005;

    icosahedron.rotation.x += deltaMove.y * rotationSpeed;
    icosahedron.rotation.y += deltaMove.x * rotationSpeed;

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// Eventos táctiles para dispositivos móviles
renderer.domElement.addEventListener('touchstart', event => {
    isDragging = true;
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
});

renderer.domElement.addEventListener('touchend', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('touchmove', event => {
    if (!isDragging || event.touches.length !== 1) return;

    const deltaMove = {
        x: event.touches[0].clientX - previousMousePosition.x,
        y: event.touches[0].clientY - previousMousePosition.y
    };

    const rotationSpeed = 0.005;

    icosahedron.rotation.x += deltaMove.y * rotationSpeed;
    icosahedron.rotation.y += deltaMove.x * rotationSpeed;

    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
    // Evitar la recarga de la página al hacer drag hacia abajo
    event.preventDefault();
});





