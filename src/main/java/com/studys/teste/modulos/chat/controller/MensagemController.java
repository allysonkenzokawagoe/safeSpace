package com.studys.teste.modulos.chat.controller;

import com.studys.teste.modulos.chat.model.Mensagem;
import com.studys.teste.modulos.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mensagem")
public class MensagemController {

    private final ChatService chatService;

    @GetMapping
    public List<Mensagem> buscarTodos() {
        return chatService.buscarTodos();
    }

    @GetMapping("{id}")
    public Mensagem buscarPorId(@PathVariable Integer id) {
        return chatService.buscarPorId(id);
    }
}
