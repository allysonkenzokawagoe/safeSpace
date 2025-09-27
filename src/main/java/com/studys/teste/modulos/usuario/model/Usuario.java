package com.studys.teste.modulos.usuario.model;

import com.studys.teste.modulos.anonimo.model.Anonimo;
import com.studys.teste.modulos.autenticacao.enums.EPermissao;
import com.studys.teste.modulos.comum.enums.ESituacao;
import com.studys.teste.modulos.psicologo.model.Psicologo;
import com.studys.teste.modulos.usuario.dto.UsuarioRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USUARIO")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NAME")
    private String nome;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "SENHA")
    private String senha;

    @Column(name = "ROLE")
    @Enumerated(EnumType.STRING)
    private EPermissao role;

    @Column(name = "DATA_CADASTRO")
    private LocalDateTime dataCadastro;

    @Column(name = "SITUACAO")
    @Enumerated(EnumType.STRING)
    private ESituacao situacao;

    @OneToOne(mappedBy = "usuario")
    private Psicologo psicologo;

    @OneToOne(mappedBy = "usuario")
    private Anonimo anonimo;

    public static Usuario of(UsuarioRequest request) {
        return Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(null)
                .role(request.role())
                .dataCadastro(LocalDateTime.now().withNano(0))
                .situacao(ESituacao.ATIVO)
                .build();
    }

    @Override
    public Collection<SimpleGrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.asSpringRole()));
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public List<String> getRoles() {
        return List.of(role.asSpringRole());
    }
}
