// articles.js
class ArticleManager {
    constructor() {
        this.articles = JSON.parse(localStorage.getItem('articles')) || [];
    }

    saveArticles() {
        localStorage.setItem('articles', JSON.stringify(this.articles));
    }

    addArticle(title, link, category = 'Geral', excerpt = '') {
        const newArticle = {
            id: Date.now(),
            title,
            link,
            category,
            excerpt,
            date: new Date().toLocaleDateString('pt-BR')
        };
        this.articles.push(newArticle);
        this.saveArticles();
    }

    deleteArticle(id) {
        this.articles = this.articles.filter(article => article.id !== id);
        this.saveArticles();
    }

    getArticles() {
        return this.articles;
    }
}

// Funções para a página de admin
function initAdmin() {
    const manager = new ArticleManager();
    const form = document.getElementById('articleForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        manager.addArticle(
            document.getElementById('title').value,
            document.getElementById('link').value,
            document.getElementById('category').value,
            document.getElementById('excerpt').value
        );
        form.reset();
        loadAdminArticles();
    });

    function loadAdminArticles() {
        const container = document.getElementById('articlesList');
        container.innerHTML = manager.getArticles().map(article => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.excerpt}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${article.date} - ${article.category}</small>
                        <div>
                            <a href="${article.link}" class="btn btn-sm btn-primary me-2" target="_blank">Ver</a>
                            <button onclick="deleteArticle(${article.id})" class="btn btn-sm btn-danger">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.deleteArticle = (id) => {
        manager.deleteArticle(id);
        loadAdminArticles();
    };

    loadAdminArticles();
}

// Funções para a página pública
function initArticles() {
    const manager = new ArticleManager();
    const container = document.getElementById('articlesGrid');

    function renderArticles() {
        container.innerHTML = manager.getArticles().map(article => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="article-card card h-100">
                    <div class="card-body">
                        <span class="badge bg-brown">${article.category}</span>
                        <h5 class="card-title mt-2">${article.title}</h5>
                        <p class="card-text">${article.excerpt}</p>
                    </div>
                    <div class="card-footer bg-white border-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="${article.link}" class="btn btn-outline-brown">Ler Artigo</a>
                            <small class="text-muted">${article.date}</small>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderArticles();
}

// Inicialização condicional
if (document.getElementById('articlesGrid')) initArticles();
if (document.getElementById('articleForm')) initAdmin();