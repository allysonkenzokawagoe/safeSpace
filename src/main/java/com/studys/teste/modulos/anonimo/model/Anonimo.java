package com.studys.teste.modulos.anonimo.model;

import com.studys.teste.modulos.anonimo.dto.AnonimoRequest;
import com.studys.teste.modulos.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "ANONIMO")
public class Anonimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NOME")
    private String nome;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "SENHA")
    private String senha;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USUARIO_ID")
    private Usuario usuario;

    public static Anonimo of(AnonimoRequest request, Usuario usuario) {
        return Anonimo.builder()
                .nome("ANONIMO" + usuario.getId())
                .email(request.email())
                .senha(request.senha())
                .usuario(usuario)
                .build();
    }
}
