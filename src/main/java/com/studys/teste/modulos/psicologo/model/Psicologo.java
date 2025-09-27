package com.studys.teste.modulos.psicologo.model;

import com.studys.teste.modulos.comum.enums.ESituacao;
import com.studys.teste.modulos.psicologo.dto.PsicologoRequest;
import com.studys.teste.modulos.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "PSICOLOGO")
public class Psicologo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NOME")
    private String nome;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "SENHA")
    private String senha;

    @Column(name = "CRP")
    private String crp;

    @Column(name = "SITUACAO")
    @Enumerated(EnumType.STRING)
    private ESituacao situacao;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USUARIO_ID")
    private Usuario usuario;

    public static Psicologo of(PsicologoRequest request, Usuario usuario) {
        return Psicologo.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(request.senha())
                .crp(request.crp())
                .situacao(ESituacao.ATIVO)
                .usuario(usuario)
                .build();
    }
}
