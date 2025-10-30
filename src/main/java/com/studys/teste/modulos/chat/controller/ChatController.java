package com.studys.teste.modulos.chat.controller;

import com.studys.teste.modulos.chat.dto.ChatMessage;
import com.studys.teste.modulos.chat.model.Mensagem;
import com.studys.teste.modulos.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mensagem")
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public List<Mensagem> buscarTodos() {
        return chatService.buscarTodos();
    }

    @GetMapping("{id}")
    public Mensagem buscarPorId(@PathVariable Integer id) {
        return chatService.buscarPorId(id);
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage enviarMensagem(ChatMessage chatMessage) {
        return chatMessage;
    }
}
