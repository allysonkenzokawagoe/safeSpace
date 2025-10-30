package com.studys.teste.modulos.chat.model;

import com.studys.teste.modulos.anonimo.model.Anonimo;
import com.studys.teste.modulos.psicologo.model.Psicologo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "MENSAGEM")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "REMENTENTE")
    private String remetente;

    @Column(name = "DESTINATARIO")
    private String destinatario;

    @Column(name = "TEXT")
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    private Anonimo anonimo;

    @ManyToOne(fetch = FetchType.LAZY)
    private Psicologo psicologo;

}
