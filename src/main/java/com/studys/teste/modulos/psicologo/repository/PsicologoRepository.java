package com.studys.teste.modulos.psicologo.repository;

import com.studys.teste.modulos.psicologo.model.Psicologo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PsicologoRepository extends JpaRepository<Psicologo, Integer>, PsicologoRepositoryCustom {
}
