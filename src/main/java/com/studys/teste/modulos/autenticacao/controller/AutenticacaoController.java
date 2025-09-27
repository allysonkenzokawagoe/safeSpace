package com.studys.teste.modulos.autenticacao.controller;

import com.studys.teste.modulos.autenticacao.dto.UsuarioAutenticado;
import com.studys.teste.modulos.autenticacao.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("oauth")
public class AutenticacaoController {

    private final JwtService jwtService;

    @PostMapping
    public UsuarioAutenticado authenticateUser(@RequestParam String username, @RequestParam String password) {
        return jwtService.autenticarUsuario(username, password);
    }

}
