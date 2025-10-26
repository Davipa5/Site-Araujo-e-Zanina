// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('artigos-container')) {
        carregarArtigosIndex(); 
    } else if (document.getElementById('artigo-titulo')) {
        carregarArtigoIndividualWorkaround(); 
    }
});

// =============================================================
// FUNÇÃO PARA A PÁGINA INICIAL (INDEX.HTML) - ATUALIZADA PARA IMAGEM
// =============================================================
async function carregarArtigosIndex() {
    const container = document.getElementById('artigos-container');
    if (!container) return; 

    const API_URL = 'http://localhost:1337';
    // Endpoint para listar com populate da capa
    const endpoint = `${API_URL}/api/artigos?populate=image_capa`; 

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Erro API (Index): ${response.statusText}`);

        const data = await response.json();
        container.innerHTML = '';
        const artigosRecentes = data.data.slice(0, 3);

        if (artigosRecentes.length === 0) {
            container.innerHTML = '<p class="text-center col-12">Nenhum artigo publicado.</p>';
            return;
        }

        artigosRecentes.forEach(artigo => {
            const id = artigo.id;
            const { Titulo: titulo, Conteudo: conteudo, autor_nome, image_capa } = artigo; 
            const resumo = (conteudo || '').substring(0, 100).replace(/[#*_]/g, '') + '...';
            const nomeAutor = autor_nome || "Autor Desconhecido";
            
            let previewImageUrl = 'images/artigo-placeholder.jpg'; 
            // ===============================
            // CORREÇÃO INDEX: Acessa a URL da imagem da forma correta
            // Primeiro checa o caminho V4 completo, depois o caminho simplificado
            // ===============================
            if (image_capa && image_capa.data && image_capa.data.attributes && image_capa.data.attributes.url) { // Caminho V4 padrão
                 previewImageUrl = API_URL + image_capa.data.attributes.url;
            } else if (image_capa && image_capa.url) { // Caminho simplificado (baseado nos seus logs)
                 previewImageUrl = API_URL + image_capa.url;
            } else {
                 console.warn(`Preview ID ${id}: Não foi possível encontrar URL em image_capa. Dados:`, image_capa);
            }


            const cardElement = document.createElement('div');
            cardElement.className = 'col-md-6 col-lg-4';
            cardElement.innerHTML = `
                <div class="card article-card h-100 shadow-sm">
                     <img src="${previewImageUrl}" class="card-img-top" alt="${titulo}" style="height: 200px; object-fit: cover;"> 
                    <div class="card-body d-flex flex-column"> 
                        <h5 class="card-title" style="color: #6D3628;">${titulo}</h5>
                        <p class="card-text text-muted small mb-2">Por: ${nomeAutor}</p> 
                        <p class="card-text text-muted flex-grow-1">${resumo}</p> 
                        <a href="artigo.html?id=${id}" class="btn btn-outline-dark mt-auto" style="border-color: #6D3628; color: #6D3628;">Leia Mais</a>
                    </div>
                </div>
            `;
            container.appendChild(cardElement);
        });

    } catch (error) {
        console.error('Erro ao buscar artigos (index):', error);
        container.innerHTML = '<p class="text-center col-12 text-danger">Falha ao carregar previews.</p>';
    }
}

// =============================================================
// FUNÇÃO PARA A PÁGINA INDIVIDUAL (ARTIGO.HTML) - WORKAROUND COM CORREÇÃO FINAL
// =============================================================
async function carregarArtigoIndividualWorkaround() {
    const params = new URLSearchParams(window.location.search);
    const artigoIdParam = params.get('id'); 

    // Seleciona elementos 
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

    if (!artigoIdParam || !tituloEl || !conteudoEl || !sumarioNavEl) { /* ... */ return; }
    const artigoId = parseInt(artigoIdParam, 10); 
    const API_URL = 'http://localhost:1337';
    const endpoint = `${API_URL}/api/artigos?populate=*`; 

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Erro lista: ${response.statusText}`);
        const data = await response.json();
        const artigo = data.data.find(a => a.id === artigoId);
        if (!artigo) throw new Error(`Artigo ID ${artigoId} não encontrado.`);
        
        console.log("DADOS COMPLETOS DO ARTIGO:", JSON.stringify(artigo, null, 2));

        // --- Preenche o HTML ---
        document.title = (artigo.Titulo || "Artigo") + " - Advocacia Araújo e Zanina";
        tituloEl.innerText = artigo.Titulo || "Artigo sem título";
        if (dataEl) dataEl.innerText = artigo.data_publicacao ? `Publicado em: ${new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}` : "";
        if (tempoEl) tempoEl.innerText = artigo.tempo_leitura ? `Tempo de leitura: ${artigo.tempo_leitura}` : "";

        // ===============================
        // CORREÇÃO FINAL - Imagem da Capa: Tenta o caminho simplificado primeiro
        // ===============================
        let capaUrl = null;
        if (artigo.image_capa && artigo.image_capa.url) { // Tenta o caminho direto primeiro
             capaUrl = API_URL + artigo.image_capa.url;
             console.log("Capa encontrada via image_capa.url");
        } 
        // Fallback para o caminho V4 completo (caso a estrutura mude)
        else if (artigo.image_capa && artigo.image_capa.data && artigo.image_capa.data.attributes && artigo.image_capa.data.attributes.url) { 
             capaUrl = API_URL + artigo.image_capa.data.attributes.url;
             console.log("Capa encontrada via image_capa.data.attributes.url");
        }

        if (capaEl && capaUrl) {
            capaEl.style.display = 'block'; 
            capaEl.src = capaUrl; 
            capaEl.alt = artigo.Titulo || "Capa do Artigo"; 
            console.log("SUCESSO CAPA:", capaEl.src); 
        } else if (capaEl) {
             capaEl.style.display = 'block'; 
             capaEl.src = 'images/artigo-placeholder.jpg'; 
             console.warn("FALHA CAPA. Dados recebidos:", artigo.image_capa); 
        }

        // ===============================
        // CORREÇÃO FINAL - Foto do Autor: Tenta o caminho simplificado primeiro
        // ===============================
        if(autorNomeEl) autorNomeEl.innerText = artigo.autor_nome || ""; 
        if(autorDescEl) autorDescEl.innerText = artigo.autor_descricao || "";
        if (autorSectionEl) autorSectionEl.style.display = 'block'; 

        let autorFotoUrl = null;
         if (artigo.autor_foto && artigo.autor_foto.url) { // Tenta o caminho direto
            autorFotoUrl = API_URL + artigo.autor_foto.url;
            console.log("Foto Autor encontrada via autor_foto.url");
        } 
        // Fallback para o caminho V4 completo
        else if (artigo.autor_foto && artigo.autor_foto.data && artigo.autor_foto.data.attributes && artigo.autor_foto.data.attributes.url) {
            autorFotoUrl = API_URL + artigo.autor_foto.data.attributes.url;
             console.log("Foto Autor encontrada via autor_foto.data.attributes.url");
        }
        
        if (autorFotoEl && autorFotoUrl) {
            autorFotoEl.src = autorFotoUrl; 
             autorFotoEl.alt = artigo.autor_nome || "Foto do Autor"; 
             console.log("SUCESSO FOTO AUTOR:", autorFotoEl.src); 
        } else if (autorFotoEl) {
             autorFotoEl.src = 'images/placeholder-autor.png'; 
             console.warn("FALHA FOTO AUTOR. Dados recebidos:", artigo.autor_foto);
        }

        // Converte Conteúdo e Gera Sumário (sem alterações aqui)
        if (typeof showdown !== 'undefined') {
            const converter = new showdown.Converter({headerLevelStart: 2}); 
            converter.setOption('ghCompatibleHeaderId', true); 
            const htmlContent = converter.makeHtml(artigo.Conteudo || "<p>Artigo sem conteúdo.</p>");
            if (conteudoEl) conteudoEl.innerHTML = htmlContent;
            gerarSumario(); 
        } else { /* ... erro showdown ... */ }

    } catch (error) {
        console.error('Erro ao buscar/processar artigo (workaround):', error); 
        if (tituloEl) tituloEl.innerText = "Erro ao carregar artigo";
        if (conteudoEl) conteudoEl.innerHTML = `<p class="text-danger">Não foi possível carregar. (${error.message})</p>`;
    }
}

// =============================================================
// FUNÇÃO PARA GERAR O SUMÁRIO DINAMICAMENTE - Sem alterações
// =============================================================
function gerarSumario() {
    const conteudoEl = document.getElementById('artigo-conteudo');
    const sumarioNavEl = document.getElementById('sumario-nav'); 
    if (!conteudoEl || !sumarioNavEl) return;
    sumarioNavEl.innerHTML = ''; 
    const headings = conteudoEl.querySelectorAll('h2, h3');
    if (headings.length === 0) { /* ... sem seções ... */ return; }
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