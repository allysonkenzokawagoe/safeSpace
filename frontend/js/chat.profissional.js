import { connectToChat, sendChatMessage, fetchAllMessages, userData } from './chat.api.js';

// --- Estado do Profissional ---
let activeStudentEmail = null; // Guarda o email do estudante que está sendo atendido
const priorityClasses = { 'alta': 'priority-alta', 'media': 'priority-media', 'baixa': 'priority-baixa' };

// --- Funções da Interface de Usuário (Profissional) ---

/**
 * Adiciona uma mensagem ao DOM.
 * Esta função é chamada tanto para o histórico quanto para novas mensagens.
 */
function displayMessageInUI(mensagem) {
    const chatMessages = document.getElementById('chatMessages');
    
    // 1. Determina se a mensagem é minha (profissional)
    const isProfessional = mensagem.remetente === userData.email;
    
    // 2. Filtra: Apenas exibe se for do estudante ATIVO ou se for a MINHA mensagem de resposta
    if (mensagem.remetente !== activeStudentEmail && !isProfessional) {
        return; 
    }

    const messageDiv = document.createElement('div');
    const messageClass = isProfessional ? 'message professional' : 'message student'; 
    messageDiv.className = messageClass;
    
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
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


/**
 * [NOVA FUNÇÃO] Carrega a fila de estudantes na barra lateral.
 * Ela usa a API 'fetchAllMessages' e filtra para achar os alunos.
 */
async function loadStudentQueue() {
    const listBody = document.getElementById('studentListBody');
    listBody.innerHTML = '<div class="text-center p-3 text-muted" id="queueLoadingState">Carregando fila...</div>';
    
    const allMessages = await fetchAllMessages();
    
    const studentEmails = [...new Set(
        allMessages
            .filter(msg => msg.remetente !== userData.email) // Pega msgs *recebidas*
            .map(msg => msg.remetente) // Pega o email do remetente
    )];

    listBody.innerHTML = ''; // Limpa o "Carregando..."

    if (studentEmails.length === 0) {
        listBody.innerHTML = '<div class="text-center p-3 text-muted">Nenhum estudante na fila.</div>';
        document.getElementById('queueTitle').textContent = `Fila de Espera (0)`;
        return;
    }

    document.getElementById('queueTitle').textContent = `Fila de Espera (${studentEmails.length})`;

    for (const email of studentEmails) {
        const studentName = email.split('@')[0] || "Estudante";
        const avatar = studentName.charAt(0).toUpperCase();

        const itemDiv = document.createElement('div');
        itemDiv.className = 'student-item';
        itemDiv.setAttribute('data-student-id', email);
        itemDiv.setAttribute('data-student-name', studentName);
        
        itemDiv.onclick = () => window.selectStudent(itemDiv);

        itemDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="d-flex align-items-center">
                    <div class="avatar avatar-small me-3">${avatar}</div>
                    <span class="fw-semibold">${studentName}</span>
                </div>
                <span class="priority-badge priority-baixa" data-priority="baixa">Normal</span>
            </div>
            <small class="text-muted d-block mt-1">Clique para ver mensagens</small>
        `;
        listBody.appendChild(itemDiv);
    }
}


/**
 * [NOVA FUNÇÃO] Callback do WebSocket.
 * Chamada toda vez que uma *nova* mensagem chega.
 */
function handleNewMessage(mensagem) {
    if (mensagem.remetente === activeStudentEmail) {
        displayMessageInUI(mensagem);
    } else {
        console.log(`Nova mensagem recebida de ${mensagem.remetente}. Recarregando a fila.`);
        loadStudentQueue();
    }
}


// ----------------------------------------
// FUNÇÕES GLOBAIS (Acessíveis pelo HTML)
// ----------------------------------------

window.sendMessage = function() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message && activeStudentEmail) {
        sendChatMessage(message, activeStudentEmail); 
        input.value = '';

        displayMessageInUI({
            remetente: userData.email, 
            text: message,
            dataEnvio: new Date().toISOString()
        });

    } else if (!activeStudentEmail) {
        alert("Por favor, selecione um estudante da fila primeiro.");
    }
}

window.handleKeyPress = function(event) {
    if (event.key === 'Enter') {
        window.sendMessage();
    }
}

/**
 * [FUNÇÃO REESCRITA]
 * Lida com a seleção de um estudante na fila lateral.
 */
window.selectStudent = async function(selectedItem) {
    document.querySelectorAll('.student-item').forEach(item => item.classList.remove('active'));
    selectedItem.classList.add('active');
    
    activeStudentEmail = selectedItem.getAttribute('data-student-id'); 
    
    const studentName = selectedItem.getAttribute('data-student-name');
    document.getElementById('studentAvatar').textContent = studentName.charAt(0).toUpperCase();
    document.getElementById('studentName').textContent = studentName;
    
    document.getElementById('emptyChatState').style.display = 'none';
    document.getElementById('chatInterface').style.display = 'flex';
    document.getElementById('messageInput').disabled = false; 

    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '<div class="text-center p-3 text-muted">Carregando histórico...</div>';

    const allMessages = await fetchAllMessages(); 

    const conversationHistory = allMessages.filter(msg => 
        (msg.remetente === activeStudentEmail && msg.destinatario === userData.email) ||
        (msg.remetente === userData.email && msg.destinatario === activeStudentEmail)
    );
    
    chatMessages.innerHTML = ''; 
    
    for (const msg of conversationHistory) {
        displayMessageInUI(msg); 
    }
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se o usuário está logado (segurança)
    if (!userData || !userData.email || !userData.isPsicologo) {
        alert("Acesso negado. Faça o login como profissional primeiro.");
        window.location.href = 'pagina-inicial.html';
        return;
    }

    // 2. Mostra o estado vazio por padrão
    document.getElementById('emptyChatState').style.display = 'flex';
    document.getElementById('chatInterface').style.display = 'none';
    
    // 3. Conecta ao WebSocket
    connectToChat(handleNewMessage); 
    
    // 4. Carrega a fila de estudantes pela primeira vez
    loadStudentQueue();
});