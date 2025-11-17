import { authenticate, registerAnonimo } from './chat.api.js';

/**
 * ARRAY COM LOGINS DE TESTE (pra n ter banco)
 */
const USUARIOS_TESTE = [
    {
        email: "estudante@teste.com",
        senha: "123456",
        tipo: "student",
        nome: "Estudante Teste"
    },
    {
        email: "profissional@teste.com", 
        senha: "123456",
        tipo: "professional",
        nome: "Profissional Teste"
    }
];

/**
 * FUNÇÃO DE VALIDAÇÃO SIMPLES COM ARRAY
 */
function validarLoginLocal(email, senha, tipo) {
    return USUARIOS_TESTE.find(usuario => 
        usuario.email === email && 
        usuario.senha === senha && 
        usuario.tipo === tipo
    );
}

/**
 * FUNÇÃO PRINCIPAL DE LOGIN (agora com validação local)
 */
window.handleLogin = async function (role) {
    const formId = role === 'student' ? 'studentForm' : 'professionalForm';
    const form = document.getElementById(formId);

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let email, senha;
    
    if (role === 'student') {
        email = document.getElementById('studentEmail').value;
        senha = document.getElementById('studentPassword').value;
    } else {
        email = document.getElementById('profEmail').value;
        senha = document.getElementById('profPassword').value;
    }

    // Validação local com array
    const usuarioValido = validarLoginLocal(email, senha, role);
    
    if (usuarioValido) {
        console.log(`✅ Login bem-sucedido: ${usuarioValido.nome}`);
        
        // Fecha o modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) loginModal.hide();

        // Redireciona para a página correta
        if (role === 'student') {
            window.location.href = 'chat-estudante.html';
        } else {
            window.location.href = 'chat-profissional.html';
        }
    } else {
        alert('❌ Email ou senha incorretos!');
        console.log('Credenciais testadas:', { email, senha, role });
    }
}

/**
 * FUNÇÃO DE CADASTRO (mantida da versão anterior)
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

    const success = true; // Simula sucesso

    if (success) {
        alert("Conta criada com sucesso! \n\nAgora você pode fazer o login.");
        toggleRegisterView(new Event('click'));
    } else {
        alert("Erro ao criar conta. Tente novamente.");
    }
}

/**
 * FUNÇÃO DE TOGGLE ENTRE LOGIN E CADASTRO
 */
window.toggleRegisterView = function (event) {
    if(event) event.preventDefault();

    const loginView = document.getElementById('student-login-view');
    const registerView = document.getElementById('student-register-view');

    if (loginView.style.display === 'none') {
        registerView.style.display = 'none';
        loginView.style.display = 'block';
    } else {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }
}

/**
 * FUNÇÃO PARA ABRIR MODAL DE LOGIN
 */
window.openLoginModal = function () {
    const loginModalElement = document.getElementById('loginModal');
    if (loginModalElement) {
        const loginModal = new bootstrap.Modal(loginModalElement);
        loginModal.show();
    } else {
        console.error('Modal de login não encontrado!');
    }
}

/**
 * INICIALIZAÇÃO DA PÁGINA
 */
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
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

    // Log dos usuários de teste disponíveis
    console.log('👥 Usuários de teste disponíveis:');
    USUARIOS_TESTE.forEach(usuario => {
        console.log(`   📧 ${usuario.email} | 🔑 ${usuario.senha} | 👤 ${usuario.tipo}`);
    });
});