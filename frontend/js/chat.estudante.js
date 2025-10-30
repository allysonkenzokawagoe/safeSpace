// js/chat.estudante.js

import { connectToChat, sendChatMessage, userData } from './chat.api.js';

// --- Funções da Interface de Usuário (Estudante) ---

/**
 * Adiciona uma mensagem ao DOM (Função de Callback para o WebSocket).
 * @param {Object} mensagem - O objeto Mensagem recebido do Spring Boot.
 */
function displayMessageInUI(mensagem) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Determina se a mensagem veio do usuário logado ou do profissional
    const isUser = mensagem.remetente === userData.email; 
    
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user' : 'message professional';
    
    // Usando a hora local atual como placeholder para a hora da mensagem
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


/**
 * ----------------------------------------
 * FUNÇÕES GLOBAIS (Acessíveis pelo HTML)
 * ----------------------------------------
 */

window.sendMessage = function() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    // Placeholder para o email/ID do destinatário (o Profissional Ativo)
    const destinatario = 'psicologo_ativo@studys.com'; 
    
    if (message && !input.disabled) {
        // Usa a função importada para enviar via WebSocket
        sendChatMessage(message, destinatario); 
        input.value = '';
    }
}

window.handleKeyPress = function(event) {
    if (event.key === 'Enter') {
        window.sendMessage();
    }
}

/**
 * Lida com o clique na sessão lateral (Histórico).
 * Esta é a função CORRIGIDA para recarregar o conteúdo da UI.
 * @param {HTMLElement} item - O elemento div.history-item clicado.
 */
window.loadChat = function(item) {
    const sessionId = item.getAttribute('data-session-id');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');

    // 1. Lógica de UI (adicionar/remover 'active')
    document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    // 2. CONEXÃO/ESTADO DO INPUT
    if (sessionId === 'session-active' && userData.email) {
        // Se for a sessão ativa, inicia ou garante a conexão WebSocket
        connectToChat(displayMessageInUI); 
        messageInput.disabled = false;
        messageInput.placeholder = "Compartilhe seus pensamentos. Suas mensagens são anônimas.";
    } else {
        // Se for uma sessão passada/fechada, desativa o input
        messageInput.disabled = true;
        messageInput.placeholder = "Esta sessão está fechada. Não é possível enviar mensagens.";
    }

    // 3. LÓGICA DE CARREGAMENTO DO HISTÓRICO (Simulação)
    let newContent = `<div class="text-center text-muted mb-4 small">Lembre-se: **Suas conversas são 100% confidenciais e seguras.**</div>`;
    
    if (sessionId === 'session-active') {
        // Conteúdo da Sessão ATIVA
        newContent += `<div class="text-center text-muted my-3 small text-uppercase fw-semibold"><i class="bi bi-calendar-check me-1"></i> Sessão Anterior: Ontem, 16:00</div>
                       <div class="message professional"><div class="message-content"><p class="mb-0">Agradeço por compartilhar. Como se sentiu após nossa última conversa?</p><div class="message-time">Ontem, 16:05</div></div></div>
                       <div class="message user"><div class="message-content"><p class="mb-0">Fiquei um pouco melhor, obrigado(a).</p><div class="message-time">Ontem, 16:08</div></div></div>
                       <div class="text-center text-muted my-3 small text-uppercase fw-semibold"><i class="bi bi-calendar-check me-1"></i> Hoje</div>
                       <div class="message professional"><div class="message-content"><p class="mb-0">Olá! Sou a psicóloga Maria. Como posso te ajudar hoje?</p><div class="message-time">14:30</div></div></div>`;

    } else if (sessionId === 'session-bullying') {
        // Conteúdo da Sessão FECHADA: Bullying
        newContent += `<div class="text-center text-muted my-3 small text-uppercase fw-semibold"><i class="bi bi-archive me-1"></i> Sessão Encerrada: 20/SET</div>
                       <div class="message user"><div class="message-content"><p class="mb-0">Preciso de ajuda com bullying, não aguento mais.</p><div class="message-time">20/SET 10:00</div></div></div>
                       <div class="message professional"><div class="message-content"><p class="mb-0">Entendo. É muito sério. Vamos analisar suas opções e o protocolo escolar.</p><div class="message-time">20/SET 10:05</div></div></div>`;

    } else if (sessionId === 'session-ansiedade') {
        // Conteúdo da Sessão FECHADA: Ansiedade
        newContent += `<div class="text-center text-muted my-3 small text-uppercase fw-semibold"><i class="bi bi-archive me-1"></i> Sessão Encerrada: 15/AGO</div>
                       <div class="message user"><div class="message-content"><p class="mb-0">Estou muito ansioso(a) com as provas.</p><div class="message-time">15/AGO 14:00</div></div></div>
                       <div class="message professional"><div class="message-content"><p class="mb-0">Normal sentir isso! Vamos praticar a técnica de respiração que te ensinei?</p><div class="message-time">15/AGO 14:02</div></div></div>`;
    }

    // Aplica o novo conteúdo de histórico e rola para baixo
    chatMessages.innerHTML = newContent;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // Tenta carregar a sessão ativa por padrão ao abrir a página
    const initialItem = document.querySelector('.history-item.active');
    if (initialItem) {
        // Chama loadChat no item inicial para configurar o estado da UI e a conexão WS
        window.loadChat(initialItem); 
    }
});