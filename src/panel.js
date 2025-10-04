// O CÓDIGO A SEGUIR DEVE SER SALVO EM SEU ARQUIVO panel.js

// Função de fechamento: Centraliza a lógica para fechar o painel.
function closePanel(sidePanel) {
    sidePanel.style.transform = 'translateX(100%)'; // Esconde o painel
}

export function createSidePanel() {
    // -- PAINEL LATERAL --
    let sidePanel = document.createElement('div');
    sidePanel.id = 'sidePanel';
    sidePanel.style.position = 'fixed';
    sidePanel.style.top = '0';
    sidePanel.style.right = '0';
    sidePanel.style.width = '350px';
    sidePanel.style.height = '100%';
    sidePanel.style.backgroundColor = 'rgba(0,0,0,0.85)';
    sidePanel.style.color = 'white';
    sidePanel.style.fontFamily = 'Arial';
    sidePanel.style.padding = '20px';
    sidePanel.style.overflowY = 'auto';
    sidePanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    sidePanel.style.transform = 'translateX(100%)'; // escondido inicialmente
    sidePanel.style.transition = 'transform 0.5s ease';
    document.body.appendChild(sidePanel);

    // Botão de fechar (CRIADO UMA VEZ E PERMANECE FIXO)
    let closeBtn = document.createElement('button');
    closeBtn.innerText = '✖ Fechar';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginBottom = '10px';
    closeBtn.style.float = 'right'; 
    sidePanel.appendChild(closeBtn);
    
    // OUVINTE DE CLIQUE FUNCIONAL
    closeBtn.addEventListener('click', () => closePanel(sidePanel));
    
    // Contêiner para o CONTEÚDO DINÂMICO
    let contentContainer = document.createElement('div');
    contentContainer.id = 'dynamicContent';
    sidePanel.appendChild(contentContainer);

    return sidePanel;
}

/**
 * Função genérica para abrir o painel com qualquer conteúdo HTML.
 */
function openPanel(sidePanel, contentHTML) {
    const contentContainer = sidePanel.querySelector('#dynamicContent');
    
    // LIMPA APENAS O CONTEÚDO
    if (contentContainer) {
        contentContainer.innerHTML = '';
    }

    // 1. Adiciona o conteúdo
    contentContainer.innerHTML = contentHTML;

    // 2. Reativa a interatividade (Antes/Depois)
    const divider = sidePanel.querySelector('#divider');
    const imgAfter = sidePanel.querySelector('#imgAfter');
    
    if (divider && imgAfter) {
        let isDragging = false;
        
        divider.addEventListener('mousedown', (e) => {
             isDragging = true;
             e.preventDefault(); 
        });
        document.addEventListener('mouseup', () => isDragging = false);
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = sidePanel.querySelector('#beforeAfter').getBoundingClientRect();
            let offset = e.clientX - rect.left;
            if (offset < 0) offset = 0;
            if (offset > rect.width) offset = rect.width;
            imgAfter.style.width = offset + 'px';
            divider.style.left = offset + 'px';
        });
    }

    // 3. Abre o painel
    sidePanel.style.transform = 'translateX(0)';
}

// ===============================================
// CONTEÚDOS ESPECÍFICOS (Templates)
// ===============================================

const brazilContent = `
    <h2 style="margin-top: 30px;">Queimadas na Amazônia</h2>
    <p><strong>2005:</strong> 2,5 milhões de hectares queimados</p>
    <p><strong>Agora:</strong> 5,3 milhões de hectares queimados</p>
    <p>Observação: aumento significativo nos últimos anos devido a desmatamento e mudanças climáticas.</p>
    
    <h3>Amazônia: Antes e Depois</h3>
    <div id="beforeAfter" style="position: relative; width: 100%; height: 200px; overflow: hidden; border-radius: 5px; cursor: ew-resize;">
        <img src="assets/images/amazonia-2005.jpg" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;" id="imgBefore">
        <img src="assets/images/amazonia-now.jpg" style="position: absolute; top:0; left:0; width:50%; height:100%; object-fit:cover;" id="imgAfter">
        <div id="divider" style="position:absolute; top:0; left:50%; width:3px; height:100%; background:#fff; cursor: ew-resize;"></div>
    </div>
    <div class="scroll-hint">
        <span>Role para Baixo</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M12 19l-7-7M12 19l7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
`;

const boliviaContent = `<h2 style="margin-top: 30px;">Destaque: Bolívia</h2><p>A Bolívia também enfrenta desafios de desmatamento na sua porção da Amazônia e região do Chaco, com focos de queimadas ligados à agricultura e pecuária.</p><p>Explore o foco da Bolívia no mapa 3D.</p>`;

const chileContent = `<h2 style="margin-top: 30px;">Destaque: Chile</h2><p>O Chile, com sua geografia de costa e montanhas, possui um impacto ambiental diferente, focado em incêndios florestais sazonais e secas prolongadas na Patagônia.</p><p>Explore o foco do Chile no mapa 3D.</p>`;


// ===============================================
// EXPORTS (Chamadas usadas no buttons.js)
// ===============================================

export function openBrazilPanel(sidePanel) {
    openPanel(sidePanel, brazilContent);
}
export function openBoliviaPanel(sidePanel) {
    openPanel(sidePanel, boliviaContent);
}
export function openChilePanel(sidePanel) {
    openPanel(sidePanel, chileContent);
}