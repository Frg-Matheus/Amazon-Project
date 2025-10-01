// após o carregamento, remove a tela de loading e mostra o botão "Start"/ "Botão dos Países"
loader.load(
    'assets/models/earth.glb',
    function (gltf) {
        earth = gltf.scene;
        scene.add(earth);
        document.body.removeChild(loadingDiv);
        document.getElementById('startButton').style.display = 'block'; // Mostrar o botão "Start"
        document.getElementById('buttonBrazil').style.display = 'block'; // Mostrar os botões dos países
        document.getElementById('buttonBolivia').style.display = 'block'; // Mostrar os botões dos países
        document.getElementById('buttonChile').style.display = 'block'; // Mostrar os botões dos países
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

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

// div com os botões dos países

// Botão Brasil

// Botão Bolivia

// Botão Chile
