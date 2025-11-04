// js/chat.estudante.js

// Importa as funções da API e os dados do usuário (que o login salvou no localStorage)
import { connectToChat, sendChatMessage, fetchAllMessages, userData } from './chat.api.js';

// TODO: Defina com seu amigo do backend UMA conta de profissional para o MVP
// Esta é a conta "central" para onde todos os estudantes vão enviar mensagens.
const PROFESSIONAL_EMAIL = "profissional@apoio.com"; 

// --- Funções da Interface de Usuário (Estudante) ---

/**
 * Adiciona uma mensagem ao DOM (Função de Callback para o WebSocket).
 * @param {Object} mensagem - O objeto Mensagem recebido (pode ser do histórico ou WebSocket).
 */
function displayMessageInUI(mensagem) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Checa se o remetente da mensagem é o usuário logado
    const isUser = mensagem.remetente === userData.email; 
    
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user' : 'message professional';
    
    // Tenta formatar a data (se existir) ou usa a hora atual
    const time = mensagem.dataEnvio 
        ? new Date(mensagem.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p class="mb-0">${mensagem.text}</p>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}


/**
 * ----------------------------------------
 * FUNÇÕES GLOBAIS (Acessíveis pelo HTML)
 * ----------------------------------------
 */

/**
 * Envia uma nova mensagem.
 * A mudança principal é no 'destinatario'.
 */
window.sendMessage = function() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    // MUDANÇA IMPORTANTE:
    // Agora o destinatário é a conta fixa do profissional (definida no topo)
    const destinatario = PROFESSIONAL_EMAIL; 
    
    if (message && !input.disabled) {
        // Usa a função importada para enviar via WebSocket
        sendChatMessage(message, destinatario); 
        input.value = '';
    }
}

/**
 * Permite enviar com "Enter".
 * Sem mudanças.
 */
window.handleKeyPress = function(event) {
    if (event.key === 'Enter') {
        window.sendMessage();
    }
}

/**
 * NOVA FUNÇÃO: Carrega o histórico inicial da conversa.
 */
async function loadInitialHistory() {
    if (!userData || !userData.email) {
        console.error("Não foi possível carregar o histórico. Dados do usuário não encontrados.");
        return;
    }

    const myEmail = userData.email;
    const professionalEmail = PROFESSIONAL_EMAIL; // A conta fixa

    // 1. Busca *todas* as mensagens (como a API atual do seu amigo faz)
    // Em uma versão futura, o ideal é a API já trazer isso filtrado.
    const allMessages = await fetchAllMessages();

    // 2. Filtra no frontend apenas as mensagens desta conversa
    const conversationHistory = allMessages.filter(msg => 
        (msg.remetente === myEmail && msg.destinatario === professionalEmail) ||
        (msg.remetente === professionalEmail && msg.destinatario === myEmail)
    );

    // 3. (Opcional) Ordena as mensagens por data/id
    // A API do seu amigo (buscarTodos) provavelmente já retorna em ordem.
    // Se não, você pode adicionar: conversationHistory.sort((a, b) => a.id - b.id);

    // 4. Limpa qualquer mensagem de "loading" (se houver) e exibe o histórico
    const chatMessages = document.getElementById('chatMessages');
    // Limpa tudo, exceto o "Lembre-se"
    chatMessages.innerHTML = `<div class="text-center text-muted mb-4 small">Lembre-se: **Suas conversas são 100% confidenciais e seguras.**</div>`;

    for (const msg of conversationHistory) {
        displayMessageInUI(msg); // Exibe cada mensagem do histórico
    }
}


// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se o usuário está logado (se 'userData' existe no localStorage)
    if (!userData || !userData.email) {
        // Se não estiver logado, desativa o input e redireciona
        const input = document.getElementById('messageInput');
        input.placeholder = "Você precisa fazer login para conversar.";
        input.disabled = true;
        
        // Redireciona para a página inicial após 2 segundos
        setTimeout(() => {
            window.location.href = 'pagina-inicial.html';
        }, 2000);
        return;
    }

    // 2. Se estiver logado, inicia a conexão do WebSocket
    // O 'displayMessageInUI' será chamado CADA VEZ que uma nova msg chegar
    connectToChat(displayMessageInUI); 

    // 3. Carrega o histórico de mensagens
    loadInitialHistory();
});