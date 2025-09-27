package com.studys.teste.modulos.psicologo.repository;

import com.studys.teste.modulos.comum.enums.ESituacao;
import com.studys.teste.modulos.psicologo.model.Psicologo;

import java.util.List;

public interface PsicologoRepositoryCustom {

    List<Psicologo> findAllByUsuarioSituacao(ESituacao situacao);

}
