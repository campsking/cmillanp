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

// Acceder a los vértices de BufferGeometry y crear cubos en cada vértice
const positionAttribute = icosahedronGeometry.attributes.position;
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); // Definir la geometría del cubo una sola vez
const createdPositions = []; // Almacenar las posiciones creadas
for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(positionAttribute, i);

    // Verificar si ya se creó un cubo en esta posición
    if (!createdPositions.some(pos => pos.equals(vertex))) {
        const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // Aplicar una posición inicial desplazada en función del índice
        cube.position.copy(vertex).multiplyScalar(1.1);

        // Agregar el cubo como hijo del icosaedro
        icosahedron.add(cube);

        // Almacenar la posición creada
        createdPositions.push(vertex);

        // Agregar una velocidad de rotación a cada cubo
        cube.userData.rotationSpeed = new THREE.Vector3(
            Math.random() * 0.01 - 0.006, // Rotación en el eje X
            Math.random() * 0.01 - 0.006, // Rotación en el eje Y
            Math.random() * 0.01 - 0.006  // Rotación en el eje Z
        );
    }
}

// estilo del cubo
icosahedron.children.forEach(cube => {
    cube.visible = true;
    cube.material.color.set(0xffffff);
});

// Raycaster para interacción
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});


// Función de animación
function animate() {
    requestAnimationFrame(animate);

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
});





