package com.studys.teste.modulos.usuario.dto;

import com.studys.teste.modulos.autenticacao.enums.EPermissao;
import com.studys.teste.modulos.comum.enums.ESituacao;
import com.studys.teste.modulos.usuario.model.Usuario;

import java.time.LocalDateTime;

public record UsuarioResponse(
        String nome,
        String email,
        String senha,
        EPermissao role,
        LocalDateTime dataCadastro,
        ESituacao situacao
) {
    public static UsuarioResponse of(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                usuario.getRole(),
                usuario.getDataCadastro(),
                usuario.getSituacao()
        );
    }
}
