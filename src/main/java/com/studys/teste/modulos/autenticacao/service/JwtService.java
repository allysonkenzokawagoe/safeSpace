package com.studys.teste.modulos.autenticacao.service;

import com.studys.teste.modulos.autenticacao.dto.UsuarioAutenticado;
import com.studys.teste.modulos.autenticacao.util.TokenUtils;
import com.studys.teste.modulos.comum.exception.UnauthorizedException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor_ = @Lazy)
public class JwtService {

    @Value("${app-config.oauth.jwt-secret}")
    private String secret;

    private final AuthenticationManager authenticationManager;
    private final AutenticacaoService autenticacaoService;
    private final BlackListTokenService blackListTokenService;

    public UsuarioAutenticado autenticarUsuario(String username, String password) {
        var authToken = new UsernamePasswordAuthenticationToken(username, password);
        var authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        var usuarioAutenticado = autenticacaoService.getUsuarioAutenticado();
        var token = gerarJwt(usuarioAutenticado);
        usuarioAutenticado.setToken(token);
        System.out.println(usuarioAutenticado);
        return usuarioAutenticado;
    }

    public void desautenticarUsuario(String token) {
        blackListTokenService.addToBlackList(token);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role").toString());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String gerarJwt(UsuarioAutenticado usuario) {
        return Jwts.builder()
                .setSubject(usuario.getUsuarioEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getKey(),  SignatureAlgorithm.HS256)
                .claim("usuarioId", usuario.getUsuarioId())
                .claim("usuarioNome", usuario.getUsuarioNome())
                .claim("usuarioEmail", usuario.getUsuarioEmail())
                .claim("roles", usuario.getRoles())
                .compact();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        var claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parse(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException ex) {
            return ex.getClaims();
        } catch (RuntimeException ex) {
            throw new UnauthorizedException("Sessão expirada");
        }
    }

    public Optional<Map<String, Object>> getTokenData() {
        return Optional.ofNullable(TokenUtils.getHeaderToken())
                .map(token -> Jwts.parserBuilder()
                        .setSigningKey(getKey()).build()
                        .parseClaimsJws(token).getBody());
    }

    private Key getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
