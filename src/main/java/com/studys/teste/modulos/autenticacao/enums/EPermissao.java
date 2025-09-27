package com.studys.teste.modulos.autenticacao.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EPermissao {
    ADMIN("ROLE_ADMIN"),
    ANONIMO("ROLE_ANONIMO"),
    PSICOLOGO("ROLE_PSICOLOGO");

    public String asSpringRole() { return "ROLE_" + name();}

    private final String valor;
}
