package com.studys.teste.modulos.chat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studys.teste.modulos.chat.model.Mensagem;
import com.studys.teste.modulos.chat.service.ChatService;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@Data
@RequiredArgsConstructor
@Component
@ServerEndpoint("/ws/chat")
public class ChatEndpoint {

    private static Set<Session> sessions = new CopyOnWriteArraySet<>();
    @Setter
    private static ChatService chatService;

    private static final ObjectMapper mapper = new ObjectMapper();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("Nova conexão: " + session.getId());
    }

    @OnMessage
    public void onMessage(String json, Session session) throws IOException {
        var mensagem = mapper.readValue(json, Mensagem.class);

        chatService.save(mensagem);

        var resposta = mapper.writeValueAsString(mensagem);
        for(Session sessao : sessions) {
            if(sessao.isOpen()) {
                sessao.getBasicRemote().sendText(resposta);
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }
}
