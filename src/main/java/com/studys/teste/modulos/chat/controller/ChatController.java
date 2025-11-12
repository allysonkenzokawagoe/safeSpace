package com.studys.teste.modulos.chat.controller; // Pacote do controller

import com.studys.teste.modulos.chat.dto.ChatMessage;
import com.studys.teste.modulos.chat.model.Mensagem;
import com.studys.teste.modulos.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/mensagemGlobal")
    @SendTo("/topic/mensagens")
    public ChatMessage enviarMensagemGlobal(ChatMessage message) {

        chatService.save(Mensagem.of(message));
        return new ChatMessage(message.from(), message.text());
    }
}
