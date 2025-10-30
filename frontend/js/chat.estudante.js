let stompClient = null;

function connect() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Conectado: ' + frame);
        stompClient.subscribe('/topic/public', function (messageOutput) {
            const mensagem = JSON.parse(messageOutput.body);
            showMessage(mensagem);
        });
    });
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const conteudo = input.value.trim();

    if (conteudo === "") return;

    const mensagem = {
        remetente: "Aluno",
        conteudo: conteudo
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(mensagem));
    input.value = "";
}

function showMessage(message) {
    const chatMessages = document.getElementById("chatMessages");

    const div = document.createElement("div");
    div.classList.add("message", "user");
    div.innerHTML = `
        <div class="message-content">
            <p class="mb-0">${message.conteudo}</p>
            <div class="message-time">Agora</div>
        </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

connect();
