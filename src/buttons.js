// O CÓDIGO A SEGUIR DEVE SER SALVO EM SEU ARQUIVO src/buttons.js

// Importa todas as funções de UI do painel.js
import { 
    createSidePanel, 
    openBrazilPanel, 
    openBoliviaPanel, 
    openChilePanel 
} from './panel.js'; 

// Cria o painel lateral DOM uma única vez (necessário para a referência 'sidePanel')
const sidePanel = createSidePanel(); 

// Variáveis de foco (as constantes são mantidas para referência de valores)
const EARTH_RADIUS = 5; 
const ZOOM_DISTANCE = 3; 

/*
 * NOTA CRÍTICA: As funções rotateToFocus, focusOnRegion, latLongToVector3, 
 * animateCamera, createBrazilPin, etc., FORAM REMOVIDAS daqui.
 * Elas devem residir APENAS no animation.js para evitar duplicação e erros de escopo.
 */

// EVENT LISTENERS DE UI

// Evento de clique ao botão "Start"
document.getElementById('startButton').addEventListener('click', () => {
    // Chama a função global definida em animation.js
    focusOnSouthAmerica(); 
    
    // Lógica de UI
    document.getElementById('startButton').style.display = 'none'; 
    document.getElementById('buttonBrazil').style.display = 'block'; 
    document.getElementById('buttonBolivia').style.display = 'block'; 
    document.getElementById('buttonChile').style.display = 'block'; 
});

// Event Listeners dos Botões de Países
document.getElementById('buttonBrazil').addEventListener('click', () => {
    // Chamadas a funções globais (animation.js) e funções do módulo (panel.js)
    focusOnBrazil();
    createBrazilPin();
    openBrazilPanel(sidePanel);
});

document.getElementById('buttonBolivia').addEventListener('click', () => {
    // Chamadas a funções globais (animation.js) e funções do módulo (panel.js)
    focusOnBolivia();
    openBoliviaPanel(sidePanel); // Função de painel da Bolívia
});

document.getElementById('buttonChile').addEventListener('click', () => {
    // Chamadas a funções globais (animation.js) e funções do módulo (panel.js)
    focusOnChile();
    openChilePanel(sidePanel); // Função de painel do Chile
});


/*
 * CÓDIGO DE CARREGAMENTO GLTF REMOVIDO:
 * * Todo o bloco 'loader.load' foi movido para o animation.js.
 * Sua responsabilidade é puramente de inicialização do 3D.
 */