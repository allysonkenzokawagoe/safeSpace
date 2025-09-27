package com.studys.teste.modulos.usuario.repository;

import com.studys.teste.modulos.comum.enums.ESituacao;
import com.studys.teste.modulos.usuario.dto.UsuarioResponse;
import com.studys.teste.modulos.usuario.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepositoryCustom {
    Boolean existsByEmail(String email);

    Optional<Usuario> findByEmail(String email);

    List<UsuarioResponse> findAllBySituacaoIsNot(ESituacao situacao);
}
