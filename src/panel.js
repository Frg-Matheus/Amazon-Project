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

    // Botão de fechar
    let closeBtn = document.createElement('button');
    closeBtn.innerText = '✖ Fechar';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginBottom = '10px';
    sidePanel.appendChild(closeBtn);
    closeBtn.addEventListener('click', () => {
        sidePanel.style.transform = 'translateX(100%)';
    });

    return sidePanel;
}

export function openBrazilPanel(sidePanel) {
    sidePanel.innerHTML = ''; // limpa conteúdo
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '✖ Fechar';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginBottom = '10px';
    sidePanel.appendChild(closeBtn);
    closeBtn.addEventListener('click', () => {
        sidePanel.style.transform = 'translateX(100%)';
    });

    sidePanel.innerHTML += `
        <h2>Queimadas na Amazônia</h2>
        <p><strong>2005:</strong> 2,5 milhões de hectares queimados</p>
        <p><strong>Agora:</strong> 5,3 milhões de hectares queimados</p>
        <p>Observação: aumento significativo nos últimos anos devido a desmatamento e mudanças climáticas.</p>
        <h3>Amazônia: Antes e Depois</h3>
        <div id="beforeAfter" style="position: relative; width: 100%; height: 200px; overflow: hidden; border-radius: 5px; cursor: ew-resize;">
            <img src="assets/images/amazonia-2005.jpg" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;" id="imgBefore">
            <img src="assets/images/amazonia-now.jpg" style="position: absolute; top:0; left:0; width:50%; height:100%; object-fit:cover;" id="imgAfter">
            <div id="divider" style="position:absolute; top:0; left:50%; width:3px; height:100%; background:#fff; cursor: ew-resize;"></div>
        </div>
    `;

    // Antes/Depois interativo
    const divider = document.getElementById('divider');
    const imgAfter = document.getElementById('imgAfter');
    let isDragging = false;

    divider.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = document.getElementById('beforeAfter').getBoundingClientRect();
        let offset = e.clientX - rect.left;
        if (offset < 0) offset = 0;
        if (offset > rect.width) offset = rect.width;
        imgAfter.style.width = offset + 'px';
        divider.style.left = offset + 'px';
    });

    // Aviso "Scroll Down"
    const scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint';
    scrollHint.innerHTML = `
        <span>Scroll Down</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M12 19l-7-7M12 19l7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    sidePanel.appendChild(scrollHint);

    // Abre o painel
    sidePanel.style.transform = 'translateX(0)';
}
