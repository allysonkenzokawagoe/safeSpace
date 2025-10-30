package com.studys.teste.modulos.chat.dto;

import com.studys.teste.modulos.chat.model.Mensagem;

public record ChatMessage(
        String from,
        String text
) {
    public static ChatMessage of(Mensagem mensagem) {
        return new ChatMessage(
                mensagem.getRemetente(),
                mensagem.getText()
        );
    }
}
