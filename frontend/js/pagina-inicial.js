/**
 * Função de redirecionamento de login.
 * Simula a validação e redireciona o usuário para o ambiente correto.
 * @param {string} role - 'student' ou 'professional'
 */
function handleLogin(role) {
    // --- Lógica de Validação Front-end (Simulação) ---
    const formId = role === 'student' ? 'studentForm' : 'professionalForm';
    const form = document.getElementById(formId);

    // Usa a validação nativa do navegador para os campos 'required'
    if (!form.checkValidity()) {
        form.reportValidity();
        return; // Impede o redirecionamento se o formulário não for válido
    }

    // Se o login for bem-sucedido (neste caso, o formulário é válido), redirecione:
    
    if (role === 'ANONIMO') {
        // Fecha o modal antes de redirecionar para uma melhor experiência
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        window.location.href = 'chat-estudante.html';
    } else if (role === 'PSICOLOGO') {
        // Fecha o modal antes de redirecionar
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        window.location.href = 'chat-profissional.html';
    } else {
        console.error('Função de login chamada com role desconhecido.');
    }
}

/**
 * Função para abrir o Modal de Login
 * Chamada por botões com onclick="openLoginModal()"
 */
function openLoginModal() {
    const loginModalElement = document.getElementById('loginModal');
    if (loginModalElement) {
        const loginModal = new bootstrap.Modal(loginModalElement);
        loginModal.show();
    } else {
        console.error('O modal de login (#loginModal) não foi encontrado!');
    }
}

/**
 * Funções que devem ser executadas após o carregamento completo do DOM
 */
document.addEventListener('DOMContentLoaded', function () {
    // --- 1. Inicialização do Tooltip do Bootstrap ---
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // --- 2. Lógica para o Modal de Vídeo (YouTube Embed) ---
    const videoModal = document.getElementById('videoModal');
    const playerContainer = document.getElementById('youtube-player');
    const videoModalLabel = document.getElementById('videoModalLabel');

    if (videoModal) {
        // Evento que dispara quando o modal está prestes a ser mostrado
        videoModal.addEventListener('show.bs.modal', function (event) {
            // Pega o card (elemento pai) que disparou o evento de clique
            const relatedCard = event.relatedTarget;
            
            // Pega o ID do vídeo do atributo de dados
            const youtubeId = relatedCard.getAttribute('data-youtube-url');
            const videoTitle = relatedCard.querySelector('.video-title').textContent;
            
            // Atualiza o título do modal
            if (videoModalLabel) {
                 videoModalLabel.textContent = videoTitle;
            }

            // Cria o iframe do YouTube (autoplay=1 e rel=0 para melhor experiência)
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&showinfo=0`);
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('frameborder', '0');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            // Insere o iframe no container
            playerContainer.innerHTML = ''; 
            playerContainer.appendChild(iframe);
        });

        // Evento que dispara quando o modal está prestes a ser escondido
        videoModal.addEventListener('hide.bs.modal', function () {
            // Para o vídeo limpando o conteúdo do container
            playerContainer.innerHTML = '';
            
            // Reseta o título
            if (videoModalLabel) {
                 videoModalLabel.textContent = 'Vídeo Informativo';
            }
        });
    }
    
    // --- 3. Smooth scroll para links de navegação ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Fechar menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        bootstrap.Collapse.getInstance(navbarCollapse).hide();
                    }
                }
            }
        });
    });
});