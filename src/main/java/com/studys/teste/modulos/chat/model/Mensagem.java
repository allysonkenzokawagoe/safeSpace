package com.studys.teste.modulos.chat.model;

import com.studys.teste.modulos.chat.dto.ChatMessage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
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

    @Column(name = "TEXT")
    private String text;

    public static Mensagem of(ChatMessage mensagem) {
        return Mensagem.builder()
                .remetente(mensagem.from())
                .text(mensagem.text())
                .build();
    }

}
