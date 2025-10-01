
  function openBrazil() {

    //Abrir imagem do brasil nos assets

    window.open('assets/img/earth-2020.jpg', '_blank');


}


  
  
  
  /*
    function openBrazil() {
    // Coordenadas aproximadas do Brasil
    const brazilLat = -14; // Latitude
    const brazilLon = -51; // Longitude

    // Converter latitude e longitude para coordenadas esféricas
    const radius = 10; // Distância da câmera ao centro da Terra
    const phi = (90 - brazilLat) * (Math.PI / 180); // Converter latitude para radianos
    const theta = (brazilLon + 180) * (Math.PI / 180); // Converter longitude para radianos

    // Calcular a posição da câmera
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    // Atualizar a posição da câmera
    camera.position.set(x, y, z);
    camera.lookAt(earth.position); // Garantir que a câmera aponte para o centro da Terra

    // Atualizar os controles de órbita
    controls.target.set(earth.position.x, earth.position.y, earth.position.z);
    controls.update();

    // Adicionar focos de queimadas
    addFireSpots();
    
    

  function addFireSpots() {
        // Exemplo de dados de focos de queimadas (latitude, longitude)
        const fireData = [
            { lat: -10, lon: -25 },
            { lat: -12, lon: -50 },
            { lat: -15, lon: -60 },
        ];

        // Adicionar marcadores no globo
        fireData.forEach((fire) => {
            const firePhi = (90 - fire.lat) * (Math.PI / 180);
            const fireTheta = (fire.lon + 180) * (Math.PI / 180);

            const fireX = 5 * Math.sin(firePhi) * Math.cos(fireTheta);
            const fireY = 5 * Math.cos(firePhi);
            const fireZ = 5 * Math.sin(firePhi) * Math.sin(fireTheta);

            const fireGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const fireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const fireMesh = new THREE.Mesh(fireGeometry, fireMaterial);

            fireMesh.position.set(fireX, fireY, fireZ);
            earth.add(fireMesh); // Adicionar o marcador ao globo
        });
    }

    // Adicionar evento ao botão "Brazil"
    document.getElementById("brazilButton").addEventListener("click", openBrazil);
*/
