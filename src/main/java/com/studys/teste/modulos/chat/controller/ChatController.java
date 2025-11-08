package com.studys.teste.modulos.chat.controller; // Pacote do controller

import com.studys.teste.modulos.chat.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/mensagemGlobal")
    @SendTo("/topic/mensagens")
    public ChatMessage enviarMensagemGlobal(ChatMessage message) {
        return new ChatMessage(message.from(), message.text());
    }
}
