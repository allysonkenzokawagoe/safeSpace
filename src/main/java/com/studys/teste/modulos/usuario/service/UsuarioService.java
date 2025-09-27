package com.studys.teste.modulos.usuario.service;

import com.studys.teste.modulos.comum.enums.ESituacao;
import com.studys.teste.modulos.comum.exception.ValidacaoException;
import com.studys.teste.modulos.usuario.dto.UsuarioRequest;
import com.studys.teste.modulos.usuario.dto.UsuarioResponse;
import com.studys.teste.modulos.usuario.model.Usuario;
import com.studys.teste.modulos.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    @Transactional
    public Usuario cadastrar(UsuarioRequest request) {
        validarEmail(request.email());
        var usuario = Usuario.of(request);
        usuario.setSenha(encoder.encode(request.senha()));
        return repository.save(usuario);
    }

    public UsuarioResponse buscarUsuario(Integer id) {
        return UsuarioResponse.of(getById(id));
    }

    public List<UsuarioResponse> buscarTodos() {
        return repository.findAllBySituacaoIsNot(ESituacao.INATIVO);
    }

    public Usuario getById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new ValidacaoException("Usuário não encontrado"));
    }

    public void excluir(Integer id) {
        var usuario = getById(id);
        usuario.setSituacao(ESituacao.INATIVO);
        repository.save(usuario);
    }

    private void validarEmail(String email) {
        if(repository.existsByEmail(email)) {
            throw new ValidacaoException("Email já cadastrado");
        }
    }

}
