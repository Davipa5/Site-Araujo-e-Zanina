// Este evento garante que o script só rode após o HTML estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    carregarArtigos();
});

/**
 * Função assíncrona para buscar e exibir os artigos do Strapi
 */
async function carregarArtigos() {
    const container = document.getElementById('artigos-container');
    if (!container) return; 

    const API_URL = 'http://localhost:1337';
    
    // ===============================
    // CORREÇÃO 1: 'imagem_capa' -> 'image_capa'
    // ===============================
    const endpoint = `${API_URL}/api/artigos?populate=image_capa`; // Removido o 'm'

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();
        container.innerHTML = '';

        const artigosRecentes = data.data.slice(0, 3);

        if (artigosRecentes.length === 0) {
            container.innerHTML = '<p class="text-center col-12">Nenhum artigo publicado ainda.</p>';
            return;
        }

        artigosRecentes.forEach(artigo => {
            const id = artigo.id;
            
            const { Titulo: titulo, Conteudo: conteudo } = artigo;
            
            let fullImageUrl = 'images/artigo-placeholder.jpg';
            
            // ===============================
            // CORREÇÃO 2: 'imagem_capa' -> 'image_capa'
            // ===============================
            const imgData = artigo.image_capa && artigo.image_capa.data; // Removido o 'm'

            if (imgData) {
                const imageUrl = imgData.attributes.url;
                fullImageUrl = `${API_URL}${imageUrl}`;
            }

            const resumo = (conteudo || '').substring(0, 100).replace(/[#*_]/g, '') + '...';

            const cardElement = document.createElement('div');
            cardElement.className = 'col-md-6 col-lg-4';
            
            cardElement.innerHTML = `
                <div class="card article-card h-100 shadow-sm">
                    <img src="${fullImageUrl}" class="card-img-top" alt="${titulo}">
                    <div class="card-body">
                        <h5 class="card-title" style="color: #6D3628;">${titulo}</h5>
                        <p class="card-text text-muted">${resumo}</p>
                        
                        <a href="artigo.html?id=${id}" class="btn btn-outline-dark" style="border-color: #6D3628; color: #6D3628;">Leia Mais</a>
                    </div>
                </div>
            `;
            
            container.appendChild(cardElement);
        });

    } catch (error) {
        console.error('Erro ao buscar artigos:', error);
        container.innerHTML = '<p class="text-center col-12 text-danger">Não foi possível carregar os artigos no momento.</p>';
    }
}