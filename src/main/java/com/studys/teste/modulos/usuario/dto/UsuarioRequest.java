package com.studys.teste.modulos.usuario.dto;

import com.studys.teste.modulos.autenticacao.enums.EPermissao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequest(
        @NotBlank
        String nome,
        @NotBlank
        String email,
        @NotBlank
        String senha,
        @NotNull
        EPermissao role
) {
        public static UsuarioRequest of(String nome, String email, String senha, EPermissao role) {
                return new UsuarioRequest(nome, email, senha, role);
        }
}
