package com.studys.teste.modulos.chat.repository;

import com.studys.teste.modulos.chat.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Mensagem, Integer> {
}
