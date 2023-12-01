package com.adm.cruddemo.mixins;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
@JsonTypeInfo(use=JsonTypeInfo.Id.NONE)
public abstract class CustomUserDetailsMixin {
    @JsonIgnore
    private Collection<? extends GrantedAuthority> authorities;

    @JsonProperty("id")
    private long id;

    @JsonProperty("email")
    private String email;

    @JsonProperty("username")
    private String username;

    @JsonIgnore
    private String password;

    @JsonProperty("enabled")
    private boolean enabled;

    @JsonProperty("accountNonExpired")
    private boolean accountNonExpired;

    @JsonProperty("accountNonLocked")
    private boolean accountNonLocked;

    @JsonProperty("credentialsNonExpired")
    private boolean credentialsNonExpired;
}
