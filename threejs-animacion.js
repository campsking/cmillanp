let scene, camera, renderer, cube;

function init() {
    // Crear una escena
    scene = new THREE.Scene();

    // Crear una cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; // La posición de la cámara en el eje Z

    // Crear un renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // Añadir objetos a la escena
    const geometry = new THREE.BoxGeometry(); // Crea una geometría simple (un cubo)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Material básico de color verde
    cube = new THREE.Mesh(geometry, material); // Crea el objeto del cubo
    scene.add(cube); // Añade el cubo a la escena

    // Comienza la animación
    animate();
}

function animate() {
    requestAnimationFrame(animate); // Llama a animate() en el próximo frame

    // Animación del objeto
    cube.rotation.x += 0.01; // Rota el cubo en el eje X
    cube.rotation.y += 0.01; // Rota el cubo en el eje Y

    renderer.render(scene, camera); // Renderiza la escena
}

// Ajustar el renderizador cuando se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inicializa la escena cuando se carga la página
init();
