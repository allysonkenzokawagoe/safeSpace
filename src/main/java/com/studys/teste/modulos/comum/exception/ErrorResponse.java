package com.studys.teste.modulos.comum.exception;

public record ErrorResponse(
        int status,
        String message
) {
}
