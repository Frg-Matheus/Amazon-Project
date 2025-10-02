//import { createSidePanel, openBrazilPanel } from './panel.js'; // Cria o painel uma vez 
//const sidePanel = createSidePanel(); 
//adicionou o painel lateral, junto com as infos de queimadas (requer dados reais das APIs, mas funcionou para teste) e a imagem de antes e depois
//porém está quebrando o código. Comentado na linha 132 e 133

//caso dê erro no zoom, deve ser arrumado por aqui
const EARTH_RADIUS = 5; //raio aproximado do modelo da terra
const ZOOM_DISTANCE = 3; //distância da câmera após o zoom

// FUNÇÕES DE ROTAÇÃO E FOCO

// Roda a Terra suavemente para o ângulo Y desejado antes de dar zoom
function rotateToFocus(targetRotationY, callback) {
    if (!earth) return;

    stopAnimation();

    //habilita temporariamente a rotação para que a animação funcione (orbitControls)
    controls.enabled = true; 

    const startRotationY = earth.rotation.y;
    const duration = 1000;
    const startTime = performance.now();
    
    // Calcula a diferença de rotação para encontrar o caminho mais curto
    let delta = targetRotationY - startRotationY;
    
    // Normaliza delta para o caminho mais curto (evita giros completos desnecessários)
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    function animateRotation() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Interpolação angular (gira a Terra suavemente)
        earth.rotation.y = startRotationY + delta * progress;

        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        } else {
            // Garante que a rotação final seja a exata
            earth.rotation.y = targetRotationY;
            
            controls.enabled = false; // Desabilita o controle novamente
            if (callback) {
                callback();
            }
        }
    }

    animateRotation();
}


//função para centralizar o zoom em uma coordenada Lat/Lon específica
function focusOnRegion(lat, lon) {
    // Calcula a rotação Y necessária para trazer a Longitude do alvo para a frente (Z negativo)
    const requiredRotationY = (lon * (Math.PI / 180)) - (1.35 * Math.PI); 

    //inicia o giro da Terra para a posição correta
    rotateToFocus(requiredRotationY, () => {
        //após o giro, calcula a posição do zoom e inicia a animação da câmera
        
        //o alvo de foco (LookAt) e a câmera não precisam mudar no X,Y,Z pois o globo já girou.

        // Ponto de Foco (Onde a câmera deve olhar - na superfície da Terra)
        const targetLookAtPosition = latLongToVector3(lat, 0, EARTH_RADIUS); // Lon=0 pois a rotação já a trouxe para frente.
        
        // Alvo da Câmera (Posição final da câmera) - Posição mais próxima da frente.
        const targetCameraPosition = latLongToVector3(lat, 0, EARTH_RADIUS + ZOOM_DISTANCE);

        // Define a câmera para olhar diretamente para o centro da tela (0, 0, 0)
        animateCamera(targetCameraPosition, new THREE.Vector3(0, 0, 0), 1000); 
    });
}

// FUNÇÕES DE FOCO ESPECÍFICAS

function focusOnSouthAmerica() {
    focusOnRegion(-20, -60); 
}

function focusOnBrazil() {
    focusOnRegion(-14, -63); 
}

function focusOnBolivia() {
    focusOnRegion(-15, -58); 
}

function focusOnChile() {
    focusOnRegion(-35, -45); 
}

/*
A lógica abaixo é para destacar a fronteira do Brasil quando o botão do Brasil for clicado.
Ela depende de como as fronteiras foram carregadas no modelo 3D (GLTF).
Se as fronteiras forem objetos separados, essa lógica pode funcionar.
Caso contrário, será necessário um método diferente para destacar a fronteira.
Além de que, essa função não estava sendo chamada antes, por isso (eu acho) não estava funcionando.
Irei refazer o código de fronteiras novamente depois.

// Supondo que as fronteiras dos países sejam objetos filhos do modelo da Terra
let countryLines = [];

function highlightFirstBorder() {
    resetBorders();
    if (countryLines[0]) {
        countryLines[0].material.color.set(highlightColor);
    }
}

document.getElementById('startButton').addEventListener('click', () => {
    focusOnSouthAmerica();
});
*/


// EVENT LISTENERS E LÓGICA DE CARREGAMENTO

// Evento de clique ao botão "Start"
document.getElementById('startButton').addEventListener('click', () => {
    focusOnSouthAmerica(); 
    document.getElementById('startButton').style.display = 'none'; 
});

// Event Listeners dos Botões de Países
document.getElementById('buttonBrazil').addEventListener('click', () => {
    focusOnBrazil();
    createBrazilPin();
    //openBrazilPanel(sidePanel);
    //highlightFirstBorder();
});

document.getElementById('buttonBolivia').addEventListener('click', () => {
    focusOnBolivia();
});

document.getElementById('buttonChile').addEventListener('click', () => {
    focusOnChile();
});


// Carregamento do modelo 3D da terra 
loader.load(
    'assets/models/earth.glb',
    function (gltf) {
        earth = gltf.scene;
        scene.add(earth);

        // após o carregamento, remove a tela de loading e mostra os botões
        document.body.removeChild(loadingDiv);
        document.getElementById('startButton').style.display = 'block'; 
        document.getElementById('buttonBrazil').style.display = 'block'; 
        document.getElementById('buttonBolivia').style.display = 'block'; 
        document.getElementById('buttonChile').style.display = 'block'; 
    },
    undefined,
    function (error) {
        console.error('Erro ao carregar o modelo GLTF:', error);
    }
);

let brazilPin;

function createBrazilPin() {
    if (brazilPin) earth.remove(brazilPin);

    const pinGeometry = new THREE.ConeGeometry(0.1, 0.5, 16);
    const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    brazilPin = new THREE.Mesh(pinGeometry, pinMaterial);

    const brazilPos = latLongToVector3(-8, -50, EARTH_RADIUS + 0.25);
    brazilPin.position.copy(brazilPos);

    const target = new THREE.Vector3(0,0,0); 
    brazilPin.lookAt(target);

    brazilPin.rotateX(Math.PI);

    earth.add(brazilPin);

    // Animação up/down (opcional)
    let direction = 1;
    function animatePin() {
        if (!brazilPin) return;
        brazilPin.position.y += 0.005 * direction;
        if (brazilPin.position.y > brazilPos.y + 0.2 || brazilPin.position.y < brazilPos.y - 0.2) direction *= -1;
        requestAnimationFrame(animatePin);
    }
    animatePin();
}

