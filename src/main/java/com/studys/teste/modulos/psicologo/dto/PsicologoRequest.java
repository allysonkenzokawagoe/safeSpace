package com.studys.teste.modulos.psicologo.dto;

public record PsicologoRequest(
        String nome,
        String email,
        String senha,
        String crp
) {
}
