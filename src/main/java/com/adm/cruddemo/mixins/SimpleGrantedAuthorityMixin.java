package com.adm.cruddemo.mixins;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use=JsonTypeInfo.Id.NONE)
public abstract class SimpleGrantedAuthorityMixin {
    @JsonCreator()
    public SimpleGrantedAuthorityMixin(@JsonProperty("authority") String role) {}
}
