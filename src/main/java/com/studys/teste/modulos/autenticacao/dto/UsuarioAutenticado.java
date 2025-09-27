package com.studys.teste.modulos.autenticacao.dto;

import com.studys.teste.modulos.usuario.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Builder
@Data
public class UsuarioAutenticado {

    private String token;
    private Integer usuarioId;
    private String usuarioNome;
    private String usuarioEmail;
    private List<String> roles;

    public UsuarioAutenticado(Map<String, Object> attributes) {
        this.usuarioId = (Integer) attributes.get("usuarioId");
        this.usuarioNome = (String) attributes.get("usuarioNome");
        this.usuarioEmail = (String) attributes.get("usuarioEmail");
        this.roles = (List<String>) attributes.get("roles");
    }

    public static UsuarioAutenticado of(Usuario usuario) {
        return UsuarioAutenticado.builder()
                .usuarioId(usuario.getId())
                .usuarioNome(usuario.getNome())
                .usuarioEmail(usuario.getEmail())
                .roles(usuario.getRoles())
                .build();
    }

}
