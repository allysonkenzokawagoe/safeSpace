package com.studys.teste.modulos.chat.service;

import com.studys.teste.modulos.chat.model.Mensagem;
import com.studys.teste.modulos.chat.repository.ChatRepository;
import com.studys.teste.modulos.comum.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final ChatRepository repository;

    public Mensagem save(Mensagem mensagem) {
        return repository.save(mensagem);
    }

    public List<Mensagem> buscarTodos() {
        return repository.findAll();
    }

    public Mensagem buscarPorId(Integer id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Mensagem não encontrada"));
    }
}
