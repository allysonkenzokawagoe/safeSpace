package com.studys.teste.modulos.psicologo.mapper;

import com.studys.teste.modulos.psicologo.dto.PsicologoResponse;
import com.studys.teste.modulos.psicologo.model.Psicologo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PsicologoMapper {

    PsicologoResponse toResponse(Psicologo psicologo);

}
