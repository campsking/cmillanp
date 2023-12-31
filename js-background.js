const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear un grupo para los cubos
const group = new THREE.Group();

// Material y Wireframe
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

// Crear cubos con esquinas redondeadas
for (let i = 0; i < 10; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    const edges = new THREE.EdgesGeometry(geometry);
    const cube = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.LineSegments(edges, wireframeMaterial);

    cube.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    // Reducir la velocidad inicial de los cubos
    cube.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);

    cube.add(wireframe);
    group.add(cube);
}

scene.add(group);
camera.position.z = 20;

// Raycaster y Mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);

    if (intersects.length > 0) {
        intersects[0].object.material.color.set(Math.random() * 0xffffff);
    }
}
window.addEventListener('click', onMouseClick, false);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    group.children.forEach(cube => {
        cube.position.add(cube.userData.velocity);

        ['x', 'y', 'z'].forEach(axis => {
            if (Math.abs(cube.position[axis]) > 10) {
                cube.userData.velocity[axis] *= -1;
            }
        });
    });

    renderer.render(scene, camera);
}
animate();
