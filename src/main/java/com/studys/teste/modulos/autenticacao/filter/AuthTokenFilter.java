package com.studys.teste.modulos.autenticacao.filter;

import com.studys.teste.config.CustomUserDetailsService;
import com.studys.teste.modulos.autenticacao.service.JwtService;
import com.studys.teste.modulos.autenticacao.util.TokenUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = TokenUtils.getHeaderToken(request);

        if(token != null && !isAuthController(request) && jwtService.isTokenValid(token)) {
            var userDetails = userDetailsService.loadUserByUsername(jwtService.extractUsername(token));
            var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            verificarAutenticacao();
        }

        filterChain.doFilter(request, response);
    }

    public void verificarAutenticacao() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            System.out.println("Nenhuma autenticação está configurada no contexto.");
        } else {
            System.out.println("Usuário autenticado: " + authentication.getName());
            System.out.println("Detalhes: " + authentication.getDetails());
            System.out.println("Roles: " + authentication.getAuthorities());
            System.out.println("Está autenticado? " + authentication.isAuthenticated());
        }
    }

    private boolean isAuthController(HttpServletRequest request) {
        return request.getRequestURI().contains("/oauth/");
    }
}
