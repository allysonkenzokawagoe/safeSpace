package com.studys.teste.modulos.autenticacao.service;

import com.studys.teste.modulos.autenticacao.dto.UsuarioAutenticado;
import com.studys.teste.modulos.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@RequiredArgsConstructor
@Service
public class AutenticacaoService {

    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    public UsuarioAutenticado getUsuarioAutenticado() {
        if(hasAuthentication()) {
            return jwtService.getTokenData()
                    .map(UsuarioAutenticado::new)
                    .orElseGet(() -> UsuarioAutenticado.of(usuarioService.getById(getUsuarioId())));
        }
        return null;
    }

    public static int getUsuarioId() {
        var user = SecurityContextHolder.getContext().getAuthentication();
        return Integer.parseInt(user.getName().split(Pattern.quote(Pattern.quote("-")))[0]);
    }

    public static boolean hasAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication() != null;
    }

}
