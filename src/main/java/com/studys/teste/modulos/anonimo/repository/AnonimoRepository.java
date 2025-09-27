package com.studys.teste.modulos.anonimo.repository;

import com.studys.teste.modulos.anonimo.model.Anonimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnonimoRepository extends JpaRepository<Anonimo, Integer> {
}
