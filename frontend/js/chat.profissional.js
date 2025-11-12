

let stompClient = null;

// Cria a conexão WebSocket com o backend Spring Boot
const socket = new SockJS("http://localhost:8000/ws");
stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log("✅ Conectado ao servidor WebSocket (profissional)");

    // Inscreve o profissional no mesmo tópico do estudante
    stompClient.subscribe("/topic/mensagens", (message) => {
        const msg = JSON.parse(message.body);

        // Exibe apenas as mensagens enviadas pelo estudante
        if (msg.sender === "estudante") {
            showMessage("Estudante", msg.content, "received");
        }
    });

    // Habilita o campo de texto após conectar
    document.getElementById("messageInput").disabled = false;
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message) {
        // Envia mensagem identificando o remetente como "profissional"
        stompClient.send("/app/mensagemGlobal", {}, JSON.stringify({
            from: "profissional",
            text: message
        }));

        showMessage("Você", message, "sent");
        input.value = "";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// Exibe mensagens na tela
function showMessage(sender, text, type) {
    const chat = document.getElementById("chatMessages");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", type === "sent" ? "text-end" : "text-start", "mb-2");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}






/*let stompClient = null;
const socket = new SockJS("http://localhost:8000/chat");
stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log("✅ Conectado ao servidor WebSocket");

    stompClient.subscribe("/topic/messages", (message) => {
        const msg = JSON.parse(message.body);
        if (msg.sender !== "profissional") { // mostra só mensagens do estudante
            showMessage("Estudante", msg.content, "received");
        }
    });

    document.getElementById("messageInput").disabled = false;
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message) {
        stompClient.send("/app/sendMessage", {}, JSON.stringify({ sender: "profissional", content: message }));
        showMessage("Você", message, "sent");
        input.value = "";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

function showMessage(sender, text, type) {
    const chat = document.getElementById("chatMessages");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", type === "sent" ? "text-end" : "text-start", "mb-2");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}*/
