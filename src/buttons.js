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


// EVENT LISTENERS DE UI

// Evento de clique ao botão "Start"
document.getElementById('startButton').addEventListener('click', () => {
    
    // === NOVO: MOVE O CONTÊINER DO GLOBO PARA A POSIÇÃO FIXA ===
    document.getElementById('webgl-container').classList.add('active');
    
    // Chama a função global definida em animation.js
    focusOnSouthAmerica(); 
    
    // Lógica de UI (Botões)
    document.getElementById('startButton').style.display = 'none'; 
    document.getElementById('buttonBrazil').style.display = 'block'; 
    document.getElementById('buttonBolivia').style.display = 'block'; 
    document.getElementById('buttonChile').style.display = 'block'; 

    // Mostra a seção de conteúdo rolável
    const storyContent = document.querySelector('.story-content');
    storyContent.style.opacity = '1';
    storyContent.style.pointerEvents = 'auto'; 
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