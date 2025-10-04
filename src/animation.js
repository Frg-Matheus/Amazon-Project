// --- VARIÁVEIS GLOBAIS ---
let isAnimating = true;
let earth;
let controls; 
const loader = new THREE.GLTFLoader(); 
const loadingDiv = document.createElement('div');
const scene = new THREE.Scene();
const EARTH_RADIUS = 5; 
const ZOOM_DISTANCE = 3; 
let brazilPin; // Variável global para o pin

// BLOQUEIA A ROLAGEM LOGO NO INÍCIO
document.body.style.overflow = 'hidden';


// --- 1. SETUP DO THREE.JS ---

scene.background = new THREE.Color(0x050505); 

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);
camera.position.set(0, 0, 10); 

// BACKGROUND ESTRELADO
function createStarryBackground() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1, 
        sizeAttenuation: true
    });

    const starVertices = [];
    const starCount = 10000; 

    for (let i = 0; i < starCount; i++) {
        const radius = 1000 + Math.random() * 500; 
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.name = 'Stars'; 
    scene.add(stars);
}
createStarryBackground(); 


// Renderizador e Anexação
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const webglContainer = document.getElementById('webgl-container');
if (webglContainer) {
    webglContainer.appendChild(renderer.domElement);
} else {
    document.body.appendChild(renderer.domElement); 
}

// Iluminação
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);


// TELA DE LOADING (Fixado para aparecer corretamente)
loadingDiv.id = 'animated-loading';
loadingDiv.style.position = 'absolute';
loadingDiv.style.top = '50%';
loadingDiv.style.left = '50%';
loadingDiv.style.transform = 'translate(-50%, -50%)';
loadingDiv.style.color = 'white'; 
loadingDiv.style.fontSize = '54px'; 
loadingDiv.innerText = ''; // Texto principal

for (let i = 1; i <= 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'loading-dot';
    dot.innerText = '.';
    dot.style.opacity = '0';
    dot.style.animationDelay = `${i * 0.2}s`;
    loadingDiv.appendChild(dot);
}
document.body.appendChild(loadingDiv);

// CONTROLE DE ÓRBITA
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.2 * Math.PI;
controls.maxPolarAngle = 0.8 * Math.PI;
controls.enablePan = false;
controls.enableRotate = false; 
controls.enableZoom = false; 


// --- 2. FUNÇÕES DE UTILIDADE (TORNADAS GLOBAIS) ---

window.rotateToFocus = function(targetRotationY, callback) {
    if (!earth) return;

    window.stopAnimation();
    controls.enabled = true; 
    const startRotationY = earth.rotation.y;
    const duration = 1000;
    const startTime = performance.now();
    let delta = targetRotationY - startRotationY;
    
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    function animateRotation() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        earth.rotation.y = startRotationY + delta * progress;
        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        } else {
            earth.rotation.y = targetRotationY;
            controls.enabled = false; 
            if (callback) {
                callback();
            }
        }
    }
    animateRotation();
}

window.latLongToVector3 = function(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180); 
    const theta = (lon + 90) * (Math.PI / 180); 

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

window.animateCamera = function(targetPosition, lookAtPosition, duration = 1500) {
    if (!earth) return;
    
    controls.enabled = true; 
    const startPosition = camera.position.clone();
    const startLookAt = controls.target.clone();
    const startTime = performance.now();

    function animateFocus() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        camera.position.copy(startPosition.clone().lerp(targetPosition, progress));
        const currentLookAt = startLookAt.clone().lerp(lookAtPosition, progress);
        camera.lookAt(currentLookAt);
        controls.target.copy(currentLookAt); 
        
        if (progress < 1) {
            requestAnimationFrame(animateFocus);
        } else {
            controls.enabled = false; 
        }
    }
    animateFocus();
}

window.stopAnimation = function() {
    isAnimating = false;
}

// Função principal de foco
window.focusOnRegion = function(lat, lon) {
    const requiredRotationY = (lon * (Math.PI / 180)) - (1.35 * Math.PI); 

    window.rotateToFocus(requiredRotationY, () => {
        const targetLookAtPosition = window.latLongToVector3(lat, 0, EARTH_RADIUS); 
        const targetCameraPosition = window.latLongToVector3(lat, 0, EARTH_RADIUS + ZOOM_DISTANCE);

        window.animateCamera(targetCameraPosition, new THREE.Vector3(0, 0, 0), 1000); 
    });
}

// --- 3. FUNÇÕES DE FOCO ESPECÍFICAS (Chamadas pelo buttons.js) ---
window.focusOnSouthAmerica = function() {
    window.focusOnRegion(-20, -60); 
}

window.focusOnBrazil = function() {
    window.focusOnRegion(-14, -63); 
}

window.focusOnBolivia = function() {
    window.focusOnRegion(-15, -58); 
}

window.focusOnChile = function() {
    window.focusOnRegion(-35, -45); 
}

// FUNÇÃO DO PIN (Corrigida e funcional)
window.createBrazilPin = function() {
    if (!earth) { return; }
    
    if (brazilPin) earth.remove(brazilPin);

    const pinGeometry = new THREE.ConeGeometry(0.1, 0.5, 16);
    const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    brazilPin = new THREE.Mesh(pinGeometry, pinMaterial);

    const brazilPos = window.latLongToVector3(-8, -50, EARTH_RADIUS + 0.25);
    brazilPin.position.copy(brazilPos);

    const target = new THREE.Vector3(0,0,0); 
    brazilPin.lookAt(target);
    brazilPin.rotateX(Math.PI); 

    earth.add(brazilPin);

    let direction = 1;
    function animatePin() {
        if (!brazilPin) return;
        
        if (brazilPin.position.y > brazilPos.y + 0.05 || brazilPin.position.y < brazilPos.y - 0.05) {
            direction *= -1;
        }
        
        brazilPin.position.y += 0.0005 * direction;
        
        window.pinAnimationId = requestAnimationFrame(animatePin);
    }
    
    if (window.pinAnimationId) {
        cancelAnimationFrame(window.pinAnimationId);
    }
    window.pinAnimationId = requestAnimationFrame(animatePin);
}


// --- 4. CÓDIGO DE CARREGAMENTO GLTF ---
loader.load(
    'assets/models/earth.glb',
    function (gltf) {
        earth = gltf.scene;
        scene.add(earth);

        // Após o carregamento:
        document.body.removeChild(loadingDiv); 
        
        //REATIVA A ROLAGEM
        document.body.style.overflow = ''; 
        
        // Estado inicial de exibição dos botões
        document.getElementById('startButton').style.display = 'block'; 
        document.getElementById('buttonBrazil').style.display = 'none'; 
        document.getElementById('buttonBolivia').style.display = 'none'; 
        document.getElementById('buttonChile').style.display = 'none'; 
    },
    undefined,
    function (error) {
        console.error('Erro ao carregar o modelo GLTF:', error);
        // Garante que a rolagem seja reativada mesmo se houver erro
        document.body.style.overflow = '';
    }
);


// --- 5. LOOP PRINCIPAL E REDIMENSIONAMENTO ---

function animate() {
    requestAnimationFrame(animate); 

    if (earth && isAnimating) {
        earth.rotation.y += 0.001;
    }

    controls.update(); 
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});