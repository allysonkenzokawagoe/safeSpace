
let stompClient = null;

const socket = new SockJS("http://localhost:8000/ws");
stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log("✅ Conectado ao servidor WebSocket (estudante)");

    stompClient.subscribe("/topic/mensagens", (message) => {
        const msg = JSON.parse(message.body);


        // Exibe apenas as mensagens enviadas pelo profissional
        if (msg.sender === "profissional") {
            showMessage("Profissional", msg.content, "received");
        }
    });

    document.getElementById("messageInput").disabled = false;
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message) {
        stompClient.send("/app/mensagemGlobal", {}, JSON.stringify({
            from: "estudante",
            text: message
        }));

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
}

/*let stompClient = null;
const socket = new SockJS("http://localhost:8000/chat");
stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    console.log("✅ Conectado ao servidor WebSocket");

    stompClient.subscribe("/topic/messages", (message) => {
        const msg = JSON.parse(message.body);
        if (msg.sender !== "estudante") { // mostra só as mensagens do profissional
            showMessage("Profissional", msg.content, "received");
        }
    });
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message) {
        stompClient.send("/app/sendMessage", {}, JSON.stringify({ sender: "estudante", content: message }));
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
}
*/