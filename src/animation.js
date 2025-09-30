const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505); 

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//posição da câmera (dependendo do monitor, necessita de um zoom out)
//deixar responsivo assim que possível
camera.position.set(0, 0, 10); 

//luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

//luz do sol (ou quase isso)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);


let earth;
const loader = new THREE.GLTFLoader();

loader.load(
    'assets/models/earth.glb',
    function (gltf) {
        earth = gltf.scene;
        
        scene.add(earth);
        console.log('Modelo da Terra carregado com sucesso!');
    },
    
    undefined, 
    
    function (error) {
        console.error('Erro ao carregar o modelo GLTF:', error);
    }
);


//controle de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


function animate() {
    requestAnimationFrame(animate); 

    if (earth && isAnimating) {
        earth.rotation.y += 0.001;
    }

    controls.update(); 
    renderer.render(scene, camera);
}


animate();

let isAnimating = true; // controle da rotação

function stopAnimation() {
    isAnimating = false;
}
//adaptar a cena ao redimensionar a tela

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Função para focar na América do Sul
function focusOnSouthAmerica() {
    if (earth) {
        // Coordenadas aproximadas para a América do Sul (ajuste conforme necessário)
        const targetPosition = new THREE.Vector3(-6, -3, 4); // Exemplo ajustado

        const startPosition = camera.position.clone();
        const duration = 1000; // 1 segundo
        const startTime = performance.now();

        function animateFocus() {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Interpolação suave
            camera.position.copy(startPosition.clone().lerp(targetPosition, progress));
            camera.lookAt(earth.position); // Garante que a câmera olhe para o centro da Terra

            if (progress < 1) {
                requestAnimationFrame(animateFocus);
            }
        }

        animateFocus();
    }
}

// Adicionar o evento de clique ao botão
document.getElementById('startButton').addEventListener('click', () => {
    stopAnimation();
    focusOnSouthAmerica();
});

