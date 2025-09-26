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
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
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

    //rotação
    if (earth) {
        earth.rotation.y += 0.001; //velocidade de rotação
    }

    //atualiza o mouse, permitindo o controle de órbita
    controls.update(); 

    //renderiza a cena a partir da perspectiva da câmera
    renderer.render(scene, camera);
}

animate();

//adaptar a cena ao redimensionar a tela

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

