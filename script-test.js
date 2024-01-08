// Creación de la escena, cámara y renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1f1f1f);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Agregar luz ambiental y direccional
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

// Crear un grupo para los modelos
const group = new THREE.Group();

// Configuración de la cuadrícula
const gridSize = 3; 
const spacing = 8;  

// OBJLoader para cargar un modelo
const loader = new THREE.OBJLoader();
loader.load('obj/cubo_1.obj', function (object) {
    // Ajustes del modelo, como escala y material, si es necesario

    // Colocar los modelos en la cuadrícula
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                const clone = object.clone();
                clone.position.set(
                    (x - (gridSize - 1) / 2) * spacing,
                    (y - (gridSize - 1) / 2) * spacing,
                    (z - (gridSize - 1) / 2) * spacing
                );
                group.add(clone);
            }
        }
    }
    scene.add(group);
}, undefined, function (error) {
    console.error('An error happened', error);
});

// Raycaster y Mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        if (selectedObject.material.color.equals(selectedColor)) {
            // Si el objeto ya tiene el color seleccionado, cambia a un color por defecto y ajusta las propiedades necesarias
            selectedObject.material.color.set(0x3f3f3f);
            // Aquí puedes ajustar otras propiedades del material si es necesario
        } else {
            // Si el objeto no tiene el color seleccionado, cambia a ese color y ajusta las propiedades necesarias
            selectedObject.material.color.set(selectedColor);
            // Aquí puedes ajustar otras propiedades del material si es necesario
        }
    }
}

// Verificar si todos los objetos tienen el color seleccionado
allObjectsOrange = group.children.every(obj => obj.material.color.equals(selectedColor));
if (allObjectsOrange) {
    scalingDown = true;
}

// Si tienes un grupo específico de objetos de esquina, actualiza esta parte
const allCornersAreOrange = cornerObjects.every(obj => obj.material.color.equals(selectedColor));
if (allCornersAreOrange) {
    // Cambiar el color de los objetos de las esquinas a azul
    cornerObjects.forEach(obj => {
        obj.material.color.set(blueColor);
        // Ajusta las propiedades del material según sea necesario
    });
}

window.addEventListener('click', onMouseClick, false);

function animate() {
    requestAnimationFrame(animate);

    // Rotar cada objeto individualmente
    group.children.forEach(obj => {
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
    });

    // Rotar el grupo constantemente, independientemente de otras animaciones
    group.rotation.x += 0.003;
    group.rotation.y += 0.003;

    // Escalar hacia abajo si todos los objetos son del color seleccionado
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

function scaleUp() {
    scaleProgress += 0.01;
    const easedProgress = easeOutBounce(scaleProgress);
    group.scale.lerp(new THREE.Vector3(1, 1, 1), easedProgress);

    if (scaleProgress >= 1) {
        scalingUp = false;
        scaleProgress = 0;

        // Restablecer cada objeto a su estado original
        group.children.forEach(obj => {
            obj.material.color.copy(obj.userData.originalColor);
            obj.position.copy(obj.userData.originalPosition);
            // Restablecer la emisividad si el objeto era originalmente del color seleccionado
            obj.material.emissive.set(obj.material.color.equals(selectedColor) ? selectedColor : 0x000000);
            obj.material.emissiveIntensity = obj.material.color.equals(selectedColor) ? 1.0 : 0.0;
        });
    }
}


animate();