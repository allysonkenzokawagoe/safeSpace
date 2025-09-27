package com.studys.teste.modulos.autenticacao.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@AllArgsConstructor
@Service
public class BlackListTokenService {

    private final Set<String> blackList;

    public void addToBlackList(String token) {
        blackList.add(token);
    }

    public boolean isBlackList(String token) {
        return blackList.contains(token);
    }
}
