package com.studys.teste.modulos.comum.dto;

import com.querydsl.core.BooleanBuilder;

public class PredicateBase {

    protected BooleanBuilder booleanBuilder;

    public PredicateBase() {this.booleanBuilder = new BooleanBuilder();}

    public BooleanBuilder builder() {return this.booleanBuilder;}
}
