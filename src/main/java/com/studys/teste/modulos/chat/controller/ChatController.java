package com.studys.teste.modulos.chat.controller;

import com.studys.teste.modulos.chat.dto.ChatMessage;
import com.studys.teste.modulos.chat.model.Mensagem;
import com.studys.teste.modulos.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService service;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("chat.sendMessage.{toUserId}")
    public void enviarMensagem(@DestinationVariable String toUserId, ChatMessage mensagem) {
        service.save(Mensagem.of(mensagem));
        messagingTemplate.convertAndSendToUser(toUserId, "/queue/mensagem", mensagem);
    }

}
