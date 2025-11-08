
import { authenticate, registerAnonimo } from './chat.api.js';


/**
 * Função de redirecionamento de login.
 * AGORA CONECTADA COM A API.
 * @param {string} role - 'student' ou 'professional'
 */
window.handleLogin = async function (role) {
    const formId = role === 'student' ? 'studentForm' : 'professionalForm';
    const form = document.getElementById(formId);

    // Usa a validação nativa do navegador
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
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
        
        if (role === 'student') {
            window.location.href = 'chat-estudante.html';
        } else if (role === 'professional') {
            window.location.href = 'chat-profissional.html';
        }
    } else {
        // A função 'authenticate' no chat.api.js já mostra um alert() de erro
        console.error("Falha no login");
    }
}

/**
 * FUNÇÃO: Lida com o clique no botão "Criar minha conta".
 */
window.handleRegister = async function () {
    const form = document.getElementById('registerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const email = document.getElementById('registerEmail').value;
    const pass = document.getElementById('registerPassword').value;
    const confirmPass = document.getElementById('registerConfirmPassword').value;

    if (pass !== confirmPass) {
        alert('As senhas não conferem!');
        return;
    }

    // Chama a API REAL de cadastro (do chat.api.js)
    const success = await registerAnonimo(email, pass);

    if (success) {
        alert("Conta criada com sucesso! \n\nAgora você pode fazer o login.");
        
        // Manda o usuário de volta para a tela de login
        toggleRegisterView(new Event('click')); // Simula um clique no link
    } else {
        // A função 'registerAnonimo' no chat.api.js já mostra um alert()
        console.error("Falha no cadastro");
    }
}


/**
 * ===================================================================
 * FUNÇÃO DE TOGGLE CORRIGIDA (sem as classes de animação)
 * ===================================================================
 * Alterna entre a "visão" de Login e a "visão" de Cadastro
 * dentro da mesma aba de Estudante.
 */
window.toggleRegisterView = function (event) {
    if(event) event.preventDefault(); // Impede o link '#' de pular a página

    const loginView = document.getElementById('student-login-view');
    const registerView = document.getElementById('student-register-view');

    // Lógica para alternar (agora sem animação)
    if (loginView.style.display === 'none') {
        // Mostra Login, Esconde Cadastro
        registerView.style.display = 'none';
        loginView.style.display = 'block';
    } else {
        // Esconde Login, Mostra Cadastro
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }
}


/**
 * Função para abrir o Modal de Login
 */
window.openLoginModal = function () {
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
        videoModal.addEventListener('show.bs.modal', function (event) {
            const relatedCard = event.relatedTarget;
            const youtubeId = relatedCard.getAttribute('data-youtube-url');
            const videoTitle = relatedCard.querySelector('.video-title').textContent;
            
            if (videoModalLabel) {
                 videoModalLabel.textContent = videoTitle;
            }

            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&showinfo=0`);
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('frameborder', '0');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            playerContainer.innerHTML = ''; 
            playerContainer.appendChild(iframe);
        });

        videoModal.addEventListener('hide.bs.modal', function () {
            playerContainer.innerHTML = '';
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