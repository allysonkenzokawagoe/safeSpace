package com.studys.teste.modulos.comum.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ValidacaoException extends RuntimeException {

    public ValidacaoException(String message) {
        super(message);
    }

}
