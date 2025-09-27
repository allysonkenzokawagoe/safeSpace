package com.studys.teste.config;

import com.studys.teste.modulos.chat.controller.ChatEndpoint;
import com.studys.teste.modulos.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@RequiredArgsConstructor
@Configuration
public class EndpointInjector {

    private final ChatService chatService;


    public void init() {
        ChatEndpoint.setChatService(chatService);
    }
}
