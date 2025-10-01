const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505); 

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);

function createStarryBackground() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1, // Tamanho da estrela
        sizeAttenuation: true // Faz com que estrelas mais distantes pareçam menores
    });

    const starVertices = [];
    const starCount = 10000; // Número de estrelas

    // Gera posições aleatórias para as estrelas em um grande volume esférico
    for (let i = 0; i < starCount; i++) {
        // Raio grande, para as estrelas ficarem bem longe
        const radius = 1000 + Math.random() * 500; 
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);

        // Conversão de coordenadas esféricas para cartesianas
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    // Para garantir que as estrelas fiquem no fundo e não se movam com a rotação da Terra
    stars.name = 'Stars'; 
    scene.add(stars);
}

createStarryBackground();

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

//carregamento do modelo 3D da terra
let earth;
const loader = new THREE.GLTFLoader();

// Tela de loading animada
const loadingDiv = document.createElement('div');
loadingDiv.id = 'animated-loading'; // ID para o CSS
loadingDiv.style.position = 'absolute';
loadingDiv.style.top = '50%';
loadingDiv.style.left = '50%';
loadingDiv.style.transform = 'translate(-50%, -50%)';
loadingDiv.style.color = 'white';
loadingDiv.style.fontSize = '54px'; // Tamanho do texto para 'Loading...'

for (let i = 1; i <= 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'loading-dot'; // Classe para o CSS
    dot.innerText = '.';
    dot.style.opacity = '0'; // Começa transparente
    dot.style.animationDelay = `${i * 0.2}s`; // Define o atraso sequencial
    loadingDiv.appendChild(dot);
}

document.body.appendChild(loadingDiv);

// após o carregamento, remove a tela de loading e mostra o botão "Start"
loader.load(
    'assets/models/earth.glb',
    function (gltf) {
        earth = gltf.scene;
        scene.add(earth);
        document.body.removeChild(loadingDiv);
        document.getElementById('startButton').style.display = 'block'; // Mostrar o botão "Start"
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

//controle de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // suaviza o movimento
controls.minDistance = 5;   // mínimo: não cola demais no globo
controls.maxDistance = 20;  // máximo: não se afasta demais
controls.minPolarAngle = 0.2 * Math.PI; // não deixa ver só o polo norte
controls.maxPolarAngle = 0.8 * Math.PI; // não deixa ver só o polo sul
controls.enablePan = false; // impede arrastar a cena pro lado

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
        // Coordenadas aproximadas para a América do Sul (tentei ajustar o máximo possível)
        const targetPosition = new THREE.Vector3(-6, -3, 4); 

        const startPosition = camera.position.clone();
        const duration = 1000; // 1 segundo
        const startTime = performance.now();

        function animateFocus() {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Interpolação suave
            camera.position.copy(startPosition.clone().lerp(targetPosition, progress));
            camera.lookAt(earth.position); // A câmera vai olhar pro centro da Terra

            if (progress < 1) {
                requestAnimationFrame(animateFocus);
            }
        }

        animateFocus();
    }
}

// Evento de clique ao botão "Start" para focar na América do Sul
document.getElementById('startButton').addEventListener('click', () => {
    stopAnimation();
    focusOnSouthAmerica();
});