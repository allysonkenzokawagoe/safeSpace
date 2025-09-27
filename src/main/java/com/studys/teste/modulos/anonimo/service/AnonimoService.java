package com.studys.teste.modulos.anonimo.service;

import com.studys.teste.modulos.anonimo.dto.AnonimoRequest;
import com.studys.teste.modulos.anonimo.mapper.AnonimoMapper;
import com.studys.teste.modulos.anonimo.model.Anonimo;
import com.studys.teste.modulos.anonimo.repository.AnonimoRepository;
import com.studys.teste.modulos.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class AnonimoService {

    private final AnonimoRepository repository;
    private final UsuarioService usuarioService;
    private final AnonimoMapper mapper;

    @Transactional
    public void cadastrar(AnonimoRequest request) {
        var usuario = usuarioService.cadastrar(mapper.toUsuarioRequest(request));
        var anonimo = Anonimo.of(request, usuario);
        repository.save(anonimo);
    }

}
