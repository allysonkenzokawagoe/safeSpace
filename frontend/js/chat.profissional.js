// js/chat.profissional.js

import { connectToChat, sendChatMessage, userData } from './chat.api.js';

// --- Estado do Profissional ---
let activeStudentEmail = null; 
const priorityClasses = { 'alta': 'priority-alta', 'media': 'priority-media', 'baixa': 'priority-baixa' };

// Dados de conversas simuladas para demonstração da troca de tela
const simulatedChatHistory = {
    'student1@anonimo.com': { // Urgente: Bullying
        name: 'Estudante 1',
        avatar: 'E1',
        content: `
            <div class="text-center text-muted mb-4 small">Início da Conversa - 27 de Setembro de 2025</div>
            <div class="message student">
                <div class="message-content"><p class="mb-0">Oi, preciso de ajuda... está acontecendo umas coisas na escola.</p><div class="message-time">14:30</div></div>
            </div>
            <div class="message professional">
                <div class="message-content"><p class="mb-0">Olá! Obrigada por entrar em contato. Estou aqui para te ouvir. Pode me contar o que está acontecendo?</p><div class="message-time">14:31</div></div>
            </div>
            <div class="message student">
                <div class="message-content"><p class="mb-0">Estou sofrendo bullying verbal na saída, e estou com medo de ir para casa.</p><div class="message-time">14:35</div></div>
            </div>
        `
    },
    'student2@anonimo.com': { // Média: Ansiedade
        name: 'Estudante 2',
        avatar: 'E2',
        content: `
            <div class="text-center text-muted mb-4 small">Sessão: Ansiedade e Provas</div>
            <div class="message student">
                <div class="message-content"><p class="mb-0">Estou muito nervoso(a) com a prova final de matemática...</p><div class="message-time">10:00</div></div>
            </div>
            <div class="message professional">
                <div class="message-content"><p class="mb-0">Entendo. É normal sentir ansiedade. Vamos falar sobre algumas técnicas de respiração e relaxamento?</p><div class="message-time">10:02</div></div>
            </div>
        `
    },
    'student3@anonimo.com': { // Baixa: Dúvidas Carreira
        name: 'Estudante 3',
        avatar: 'E3',
        content: `
            <div class="text-center text-muted mb-4 small">Sessão: Dúvidas sobre Carreira</div>
            <div class="message student">
                <div class="message-content"><p class="mb-0">Não sei o que escolher para o futuro, estou perdido(a)...</p><div class="message-time">11:15</div></div>
            </div>
            <div class="message professional">
                <div class="message-content"><p class="mb-0">Ótimo! Temos algumas ferramentas de orientação vocacional que podem te ajudar a mapear seus interesses. Quer dar uma olhada?</p><div class="message-time">11:18</div></div>
            </div>
        `
    }
};


// --- Funções da Interface de Usuário (Profissional) ---

function displayMessageInUI(mensagem) {
    const chatMessages = document.getElementById('chatMessages');
    
    // 1. Determina se a mensagem é minha (profissional)
    const isProfessional = mensagem.remetente === userData.email;
    
    // 2. Filtra: Apenas exibe se for do estudante ATIVO ou se for a MINHA mensagem de resposta
    if (mensagem.remetente !== activeStudentEmail && !isProfessional) {
        return; 
    }

    const messageDiv = document.createElement('div');
    // Usando as classes definidas no seu CSS
    const messageClass = isProfessional ? 'message professional' : 'message student'; 
    messageDiv.className = messageClass;
    
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p class="mb-0">${mensagem.text}</p>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// ----------------------------------------
// FUNÇÕES GLOBAIS (Acessíveis pelo HTML)
// ----------------------------------------

window.sendMessage = function() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message && activeStudentEmail) {
        // Simulação de envio da minha própria mensagem
        displayMessageInUI({ remetente: userData.email, text: message }); 
        
        // Envia para o servidor/estudante (API real)
        sendChatMessage(message, activeStudentEmail); 
        input.value = '';
    }
}

window.handleKeyPress = function(event) {
    if (event.key === 'Enter') {
        window.sendMessage();
    }
}

/**
 * Lida com a seleção de um estudante na fila lateral.
 * @param {HTMLElement} selectedItem - O elemento div.student-item clicado.
 */
window.selectStudent = function(selectedItem) {
    // 1. Lógica de UI (remover/adicionar active)
    document.querySelectorAll('.student-item').forEach(item => item.classList.remove('active'));
    selectedItem.classList.add('active');
    
    // 2. ATUALIZA O ESTADO GLOBAL
    activeStudentEmail = selectedItem.getAttribute('data-student-id'); 
    
    // 3. Obtém dados do estudante e do chat simulado
    const studentData = simulatedChatHistory[activeStudentEmail];
    
    // 4. Atualiza o Header e Avatar
    const nameElement = selectedItem.querySelector('.fw-bold, .fw-semibold');
    const name = nameElement ? nameElement.textContent.trim() : 'Nome Desconhecido';

    document.getElementById('studentAvatar').textContent = studentData.avatar;
    document.getElementById('studentName').textContent = studentData.name;
    
    // 5. Atualiza o Badge de Prioridade
    const priorityBadge = selectedItem.querySelector('.priority-badge');
    const priorityText = priorityBadge.textContent;
    const priorityData = priorityBadge.getAttribute('data-priority');

    const studentPriority = document.getElementById('studentPriority');
    studentPriority.textContent = priorityText;
    studentPriority.className = `priority-badge ${priorityClasses[priorityData]}`; 
    
    // 6. CARREGA O HISTÓRICO DE MENSAGENS SIMULADO (O QUE ESTAVA FALTANDO)
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = studentData.content;
    chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para o final
    
    // 7. Garante que o painel de chat esteja visível e o estado vazio escondido
    const emptyState = document.getElementById('emptyChatState');
    if (emptyState) emptyState.style.display = 'none';
    document.getElementById('chatInterface').style.display = 'flex';
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // Simulação de dados do usuário logado (Profissional)
    userData.email = "profissional@apoio.com";
    userData.isPsicologo = true;
    
    if (userData.isPsicologo) {
        // Conecta imediatamente para começar a ouvir a fila de novos chats
        // connectToChat(displayMessageInUI); // Comentado para não precisar da API
    }
    
    // Selecionar o primeiro estudante ativo na inicialização
    const initialStudent = document.querySelector('.student-item.active');
    
    if (initialStudent) {
        window.selectStudent(initialStudent);
    } else {
        // Se nenhum estudante estiver ativo inicialmente, mostre a tela vazia
        document.getElementById('emptyChatState').style.display = 'block';
        document.getElementById('chatInterface').style.display = 'none';
    }
});