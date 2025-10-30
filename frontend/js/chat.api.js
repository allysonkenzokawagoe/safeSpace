// js/chat.api.js

// --- CONFIGURAÇÃO E ESTADO GLOBAL ---
const API_BASE_URL = 'http://localhost:8080';
const WS_ENDPOINT = API_BASE_URL + '/ws'; 

let stompClient = null;
let currentToken = localStorage.getItem('authToken'); 
export let userData = JSON.parse(localStorage.getItem('userData')) || {};

// =========================================================================
// Rota REST: Autenticação, Cadastro de Usuário e Cadastro de Anonimo
// =========================================================================

/**
 * ----------------------------------------
 * 1. AUTENTICAÇÃO (POST /oauth)
 * ----------------------------------------
 */
export async function authenticate(username, password) {
    const url = `${API_BASE_URL}/oauth?username=${username}&password=${password}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Falha na autenticação: ${response.statusText}`);
        }

        const data = await response.json();
        currentToken = data.token;
        
        userData = {
            token: data.token,
            email: data.usuarioEmail,
            nome: data.usuarioNome,
            isPsicologo: data.roles.some(r => r.includes('PSICOLOGO') || r.includes('ADMIN'))
        };
        localStorage.setItem('authToken', currentToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        console.log("Autenticação bem-sucedida.");
        return data;

    } catch (error) {
        console.error("Erro ao autenticar:", error);
        alert("Erro na autenticação. Verifique login e senha.");
        return null;
    }
}

/**
 * ----------------------------------------
 * 2. CADASTRO ANÔNIMO (POST /api/anonimo)
 * ----------------------------------------
 */
export async function registerAnonimo(email, senha) {
    const url = `${API_BASE_URL}/api/anonimo`;
    
    const requestBody = {
        email: email,
        senha: senha
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (response.status === 200 || response.status === 204) {
             console.log("Cadastro de Anônimo bem-sucedido.");
             return true;
        }

        const errorData = await response.json();
        throw new Error(`Falha no cadastro: ${errorData.message || response.statusText}`);

    } catch (error) {
        console.error("Erro ao cadastrar anônimo:", error);
        alert(`Erro: ${error.message}`);
        return false;
    }
}

// =========================================================================
// Comunicação WebSocket/STOMP (Chat em Tempo Real)
// =========================================================================

/**
 * Inicia a conexão com o servidor WebSocket/STOMP.
 */
export function connectToChat(onMessageCallback) {
    if (!currentToken) {
        console.error("Token JWT ausente. Conecte-se primeiro.");
        return;
    }
    
    if (stompClient && stompClient.connected) return;

    let socket = new SockJS(WS_ENDPOINT);
    stompClient = Stomp.over(socket);

    const headers = { 'Authorization': `Bearer ${currentToken}` };

    stompClient.connect(
        headers, 
        () => onConnected(onMessageCallback), 
        (error) => onError(error, onMessageCallback)
    );
}

function onConnected(onMessageCallback) {
    console.log('Conexão WebSocket STOMP estabelecida.');
    
    const topic = userData.isPsicologo 
        ? '/topic/public' 
        : `/user/${userData.email}/queue/messages`; 
        
    stompClient.subscribe(topic, (payload) => {
        let mensagem;
        try {
            mensagem = JSON.parse(payload.body);
            onMessageCallback(mensagem);
        } catch (e) {
            console.error("Erro ao processar mensagem recebida:", e);
        }
    });
}

function onError(error, onMessageCallback) {
    console.error('Erro na conexão WebSocket:', error);
    setTimeout(() => connectToChat(onMessageCallback), 5000); 
}

function onMessageReceived(payload, onMessageCallback) {
    let mensagem;
    try {
        mensagem = JSON.parse(payload.body); 
    } catch (e) {
        console.error("Erro ao parsear mensagem JSON:", e);
        return;
    }
    
    onMessageCallback(mensagem); 
}

/**
 * ----------------------------------------
 * 3. ENVIAR MENSAGEM (WebSocket - /app/chat)
 * ----------------------------------------
 */
export function sendChatMessage(text, destinatario) {
    if (!stompClient || stompClient.connected === false) {
        console.error("Cliente STOMP não conectado.");
        return;
    }
    
    const messageObject = {
        remetente: userData.email, 
        destinatario: destinatario,
        text: text,
    };
    
    const destination = '/app/chat'; 
    
    stompClient.send(destination, {}, JSON.stringify(messageObject));
}

/**
 * ----------------------------------------
 * 4. ROTAS REST PARA DADOS (Ex: Histórico)
 * ----------------------------------------
 */

export async function fetchAllMessages() {
    if (!currentToken) {
        console.error("Token JWT ausente.");
        return [];
    }

    const url = `${API_BASE_URL}/api/mensagem`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Falha ao buscar histórico: ${response.statusText}`);
        }
        
        return response.json(); // Retorna List<Mensagem>

    } catch (error) {
        console.error("Erro ao buscar histórico de mensagens:", error);
        return [];
    }
}