const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1f1f1f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.6), 0.1, 1000);
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

// Crear un grupo para los cubos
const group = new THREE.Group();

const gridSize = 3; // Tamaño de la cuadrícula (3x3x3)
const spacing = 8;  // Espaciado entre cubos
const cubeSize = 2; // Tamaño de cada cubo
const selectedColor = new THREE.Color(0xFF6600); // Color naranja para cubos seleccionados


// Crear cubos y colocarlos en una cuadrícula
for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

            // Determinar el color del cubo (naranja para el cubo central)
            const isCenterCube = x === 1 && y === 1 && z === 1;
            const cubeColor = isCenterCube ? selectedColor : 0x3f3f3f;

            const material = new THREE.MeshStandardMaterial({
                color: isCenterCube ? selectedColor : 0x3f3f3f,
                emissive: isCenterCube ? selectedColor : 0x000000, // Hacer que los cubos naranjas sean emisivos
                emissiveIntensity: isCenterCube ? 1.0 : 0.0, // Ajustar la intensidad de la emisión para cubos naranjas
                roughness: 0.5,
                metalness: 0.5
            });

            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (x - (gridSize - 1) / 2) * spacing,
                (y - (gridSize - 1) / 2) * spacing,
                (z - (gridSize - 1) / 2) * spacing
            );

            // Almacenar velocidad de rotación y color original en userData
            cube.userData.rotationSpeed = {
                x: Math.random() * 0.05 - 0.025,
                y: Math.random() * 0.05 - 0.025
            };
            cube.userData.originalColor = cubeColor;

            // Almacenar el estado original del cubo
            cube.userData.originalColor = cube.material.color.clone();
            cube.userData.originalPosition = cube.position.clone();


            group.add(cube);
        }
    }
}
scene.add(group);

// Raycaster y Mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variables de control de la animación
let allCubesOrange = false;
let scalingDown = false;
let scalingUp = false;
let scaleProgress = 0;

// Manejador de eventos para el clic
function onMouseClick(event) {
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);

    if (intersects.length > 0) {
        const selectedCube = intersects[0].object;
        if (selectedCube.material.color.equals(selectedColor)) {
            // Si el cubo ya es naranja, cambia a gris y desactiva la emisividad
            selectedCube.material.color.set(0x3f3f3f);
            selectedCube.material.emissive.set(0x000000);
            selectedCube.material.emissiveIntensity = 0.0;
        } else {
            // Si el cubo es gris, cambia a naranja y activa la emisividad
            selectedCube.material.color.set(selectedColor);
            selectedCube.material.emissive.set(selectedColor);
            selectedCube.material.emissiveIntensity = 1.0;
        }
    }

    // Verificar si todos los cubos son naranjas
    allCubesOrange = group.children.every(cube => cube.material.color.equals(selectedColor));
    if (allCubesOrange) {
        scalingDown = true;
    }
    // Verificar si todos los cubos de esquina son naranjas
    const allCornersAreOrange = cornerCubes.every(cube => cube.material.color.equals(selectedColor));
    if (allCornersAreOrange) {
        // Cambiar el color de los cubos de las esquinas a azul
        cornerCubes.forEach(cube => {
            cube.material.color.set(blueColor);
            cube.material.emissive.set(blueColor);
            cube.material.emissiveIntensity = 1.0;
        });
    }
}
window.addEventListener('click', onMouseClick, false);

// Manejador de eventos para el redimensionamiento de la ventana
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / (window.innerHeight * 0.6);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar cada cubo individualmente
    group.children.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
    });
    // Rotar el grupo constantemente, independientemente de otras animaciones
    group.rotation.x += 0.003;
    group.rotation.y += 0.003;

    // Escalar hacia abajo si todos los cubos son naranjas
    if (scalingDown) {
        scaleDown();
    }

    // Escalar hacia arriba una vez que la escala del grupo es mínima
    if (scalingUp) {
        scaleUp();
    }

    // Renderizar la escena y la cámara
    renderer.render(scene, camera);
}

// Función de suavizado para el efecto de rebote
function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

// Función scaleDown modificada
function scaleDown() {
    scaleProgress += 0.01;
    const easedProgress = easeOutBounce(scaleProgress);
    group.scale.lerp(new THREE.Vector3(0.1, 0.1, 0.1), easedProgress);

    if (scaleProgress >= 1) {
        scalingDown = false;
        scalingUp = true;
        scaleProgress = 0;
    }
}

// Función scaleUp modificada
function scaleUp() {
    scaleProgress += 0.01;
    const easedProgress = easeOutBounce(scaleProgress);
    group.scale.lerp(new THREE.Vector3(1, 1, 1), easedProgress);

    if (scaleProgress >= 1) {
        scalingUp = false;
        scaleProgress = 0;

        // Restablecer cada cubo a su estado original
        group.children.forEach(cube => {
            cube.material.color.copy(cube.userData.originalColor);
            cube.position.copy(cube.userData.originalPosition);
            // Restablecer la emisividad si el cubo era originalmente naranja
            cube.material.emissive.set(cube.material.color.equals(selectedColor) ? selectedColor : 0x000000);
            cube.material.emissiveIntensity = cube.material.color.equals(selectedColor) ? 1.0 : 0.0;
        });
    }
}

animate();