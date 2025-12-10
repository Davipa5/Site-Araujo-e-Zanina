// =============================================================
// Bloco de Execução Principal
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Carrega Artigos (Index)
    if (document.getElementById('artigos-container')) {
        carregarArtigosIndex(); 
    } 

    // 2. Carrega Na Mídia (Index)
    if (document.getElementById('midia-container')) {
        carregarMidia();
    }

    // 3. Carrega Artigo Individual
    if (document.getElementById('artigo-titulo')) {
        carregarArtigoIndividualWorkaround(); 
    }
});


// =============================================================
// FUNÇÃO AUXILIAR: Renderiza Itens em Formato de Carrossel Bootstrap
// =============================================================
function renderizarCarrossel(itens, containerId, criarCardHtml) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ''; // Limpa loader
    
    if (!itens || itens.length === 0) {
        container.innerHTML = '<div class="carousel-item active"><p class="text-center col-12 p-5 text-muted">Nenhum item encontrado.</p></div>';
        return;
    }

    // Configuração: 3 itens por slide em desktop
    const itensPorSlide = 3;
    let isActive = true; 

    // Loop para criar os grupos (slides)
    for (let i = 0; i < itens.length; i += itensPorSlide) {
        const grupoItens = itens.slice(i, i + itensPorSlide);
        
        // Cria o elemento do Slide (carousel-item)
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-item ${isActive ? 'active' : ''}`;
        isActive = false; 

        // Cria a linha (row) dentro do slide
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row g-4 justify-content-center'; 

        // Adiciona os cards ao slide
        grupoItens.forEach(item => {
            const cardHtml = criarCardHtml(item); 
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-6 col-lg-4'; 
            colDiv.innerHTML = cardHtml;
            rowDiv.appendChild(colDiv);
        });

        slideDiv.appendChild(rowDiv);
        container.appendChild(slideDiv);
    }
}


// =============================================================
// FUNÇÃO: Carregar "Na Mídia" (Com Carrossel)
// =============================================================
async function carregarMidia() {
    const API_URL = 'http://localhost:1337';
    const endpoint = `${API_URL}/api/midias?populate=*`; 
    
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Erro API: ${response.statusText}`);
        const data = await response.json();
        
        // Função que desenha o card específico de Mídia
        const criarCardMidia = (item) => {
            const dados = item.attributes || item;
            const { Titulo: titulo, Resumo: resumo, Link: linkUrl, Foto: fotoRaw } = dados;
            
            let imageUrl = 'images/artigo-placeholder.jpg';
            
            // Lógica robusta para pegar a imagem (Array ou Objeto)
            const fotoObj = Array.isArray(fotoRaw) ? fotoRaw[0] : fotoRaw;
            if (fotoObj) {
                if (fotoObj.url) imageUrl = API_URL + fotoObj.url;
                else if (fotoObj.attributes?.url) imageUrl = API_URL + fotoObj.attributes.url;
                else if (fotoObj.data?.attributes?.url) imageUrl = API_URL + fotoObj.data.attributes.url;
            }

            return `
                <div class="card h-100 shadow-sm border-0" style="min-height: 350px;">
                    <a href="${linkUrl || '#'}" target="_blank" class="text-decoration-none">
                        <img src="${imageUrl}" class="card-img-top" alt="${titulo}" style="height: 200px; object-fit: cover;"> 
                        <div class="card-body text-center d-flex flex-column"> 
                            <h5 class="card-title text-truncate" style="color: #6D3628;">${titulo || 'Sem Título'}</h5>
                            <p class="card-text text-muted small flex-grow-1" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${resumo || ''}</p> 
                            <button class="btn btn-sm btn-outline-dark mt-auto" style="border-color: #6D3628; color: #6D3628;">Acessar</button>
                        </div>
                    </a>
                </div>
            `;
        };

        renderizarCarrossel(data.data, 'midia-container', criarCardMidia);

    } catch (error) {
        console.error('Erro ao buscar mídias:', error);
        document.getElementById('midia-container').innerHTML = '<p class="text-center col-12 text-danger">Erro ao carregar mídia.</p>';
    }
}


// =============================================================
// FUNÇÃO: Carregar Artigos (Com Carrossel)
// =============================================================
async function carregarArtigosIndex() {
    const API_URL = 'http://localhost:1337';
    // Removemos o limite de 3 para permitir o carrossel navegar por todos
    const endpoint = `${API_URL}/api/artigos?populate=image_capa&sort=createdAt:desc`; 

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Erro API: ${response.statusText}`);
        const data = await response.json();

        // Função que desenha o card específico de Artigo
        const criarCardArtigo = (artigo) => {
            const id = artigo.id;
            const item = artigo.attributes || artigo; 
            const { Titulo: titulo, Conteudo: conteudo, autor_nome, image_capa } = item;
            
            const resumo = (conteudo || '').substring(0, 100).replace(/[#*_]/g, '') + '...';
            const nomeAutor = autor_nome || "Autor Desconhecido";
            
            let previewImageUrl = 'images/artigo-placeholder.jpg';
            if (image_capa && image_capa.data && image_capa.data.attributes) previewImageUrl = API_URL + image_capa.data.attributes.url;
            else if (image_capa && image_capa.url) previewImageUrl = API_URL + image_capa.url;

            return `
                <div class="card article-card h-100 shadow-sm">
                     <img src="${previewImageUrl}" class="card-img-top" alt="${titulo}" style="height: 200px; object-fit: cover;"> 
                    <div class="card-body d-flex flex-column"> 
                        <h5 class="card-title text-truncate" style="color: #6D3628;">${titulo}</h5>
                        <p class="card-text text-muted small mb-2">Por: ${nomeAutor}</p> 
                        <p class="card-text text-muted flex-grow-1 small">${resumo}</p> 
                        <a href="artigo.html?id=${id}" class="btn btn-outline-dark mt-auto" style="border-color: #6D3628; color: #6D3628;">Leia Mais</a>
                    </div>
                </div>
            `;
        };

        renderizarCarrossel(data.data, 'artigos-container', criarCardArtigo);

    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        document.getElementById('artigos-container').innerHTML = '<p class="text-center col-12 text-danger">Falha ao carregar artigos.</p>';
    }
}


// =============================================================
// FUNÇÃO PARA ARTIGO INDIVIDUAL (MANTIDA IGUAL AO ORIGINAL)
// =============================================================
async function carregarArtigoIndividualWorkaround() {
    const params = new URLSearchParams(window.location.search);
    const artigoIdParam = params.get('id'); 

    const tituloEl = document.getElementById('artigo-titulo');
    const conteudoEl = document.getElementById('artigo-conteudo');
    const dataEl = document.getElementById('artigo-data');
    const tempoEl = document.getElementById('artigo-tempo-leitura');
    const capaEl = document.getElementById('artigo-imagem-capa');
    const autorNomeEl = document.getElementById('autor-nome');
    const autorDescEl = document.getElementById('autor-descricao');
    const autorFotoEl = document.getElementById('autor-foto');
    const autorSectionEl = document.querySelector('.author-section');
    const sumarioNavEl = document.getElementById('sumario-nav'); 

    if (!artigoIdParam || !tituloEl || !conteudoEl || !sumarioNavEl) { return; }
    
    const artigoId = parseInt(artigoIdParam, 10); 
    const API_URL = 'http://localhost:1337';
    const endpoint = `${API_URL}/api/artigos?populate=*`; 

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Erro lista: ${response.statusText}`);
        const data = await response.json();
        
        const artigoResult = data.data.find(a => a.id === artigoId);
        if (!artigoResult) throw new Error(`Artigo ID ${artigoId} não encontrado.`);
        
        const artigo = artigoResult.attributes || artigoResult;
        
        document.title = (artigo.Titulo || "Artigo") + " - Advocacia Araújo e Zanina";
        tituloEl.innerText = artigo.Titulo || "Artigo sem título";
        if (dataEl) dataEl.innerText = artigo.data_publicacao ? `Publicado em: ${new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}` : "";
        if (tempoEl) tempoEl.innerText = artigo.tempo_leitura ? `Tempo de leitura: ${artigo.tempo_leitura}` : "";

        // Imagem da Capa
        let capaUrl = null;
        if (artigo.image_capa && artigo.image_capa.url) { 
             capaUrl = API_URL + artigo.image_capa.url;
        } else if (artigo.image_capa && artigo.image_capa.data && artigo.image_capa.data.attributes && artigo.image_capa.data.attributes.url) { 
             capaUrl = API_URL + artigo.image_capa.data.attributes.url;
        }

        if (capaEl) {
            capaEl.style.display = 'block'; 
            if (capaUrl) {
                capaEl.src = capaUrl; 
                capaEl.alt = artigo.Titulo || "Capa do Artigo"; 
            } else {
                capaEl.src = 'images/artigo-placeholder.jpg'; 
            }
        }

        // Autor
        if(autorNomeEl) autorNomeEl.innerText = artigo.autor_nome || ""; 
        if(autorDescEl) autorDescEl.innerText = artigo.autor_descricao || "";
        if (autorSectionEl) autorSectionEl.style.display = 'block'; 

        let autorFotoUrl = null;
        if (artigo.autor_foto && artigo.autor_foto.url) { 
            autorFotoUrl = API_URL + artigo.autor_foto.url;
        } else if (artigo.autor_foto && artigo.autor_foto.data && artigo.autor_foto.data.attributes && artigo.autor_foto.data.attributes.url) {
            autorFotoUrl = API_URL + artigo.autor_foto.data.attributes.url;
        }
        
        if (autorFotoEl) {
            if (autorFotoUrl) {
                autorFotoEl.src = autorFotoUrl; 
                autorFotoEl.alt = artigo.autor_nome || "Foto do Autor"; 
            } else {
                autorFotoEl.src = 'images/placeholder-autor.png'; 
            }
        }

        // Markdown -> HTML
        if (typeof showdown !== 'undefined') {
            const converter = new showdown.Converter({headerLevelStart: 2}); 
            converter.setOption('ghCompatibleHeaderId', true); 
            const htmlContent = converter.makeHtml(artigo.Conteudo || "<p>Artigo sem conteúdo.</p>");
            if (conteudoEl) conteudoEl.innerHTML = htmlContent;
            gerarSumario(); 
        }

    } catch (error) {
        console.error('Erro ao buscar/processar artigo (workaround):', error); 
        if (tituloEl) tituloEl.innerText = "Erro ao carregar artigo";
        if (conteudoEl) conteudoEl.innerHTML = `<p class="text-danger">Não foi possível carregar. (${error.message})</p>`;
    }
}

// =============================================================
// FUNÇÃO PARA GERAR O SUMÁRIO DINAMICAMENTE
// =============================================================
function gerarSumario() {
    const conteudoEl = document.getElementById('artigo-conteudo');
    const sumarioNavEl = document.getElementById('sumario-nav'); 
    if (!conteudoEl || !sumarioNavEl) return;
    sumarioNavEl.innerHTML = ''; 
    const headings = conteudoEl.querySelectorAll('h2, h3');
    if (headings.length === 0) { return; }

    headings.forEach(heading => {
        const level = heading.tagName.toLowerCase(); 
        const text = heading.textContent;
        let id = heading.getAttribute('id');
        if (!id) { id = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''); heading.setAttribute('id', id); }
        if (text && id) {
            const link = document.createElement('a');
            link.href = `#${id}`; link.textContent = text; link.className = 'nav-link'; 
            if (level === 'h2') link.classList.add('fw-bold', 'mt-2'); 
            else if (level === 'h3') link.classList.add('ms-3'); 
            sumarioNavEl.appendChild(link);
        }
    });
}