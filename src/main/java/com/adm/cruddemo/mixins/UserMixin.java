package com.adm.cruddemo.mixins;

import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@JsonTypeInfo(use=JsonTypeInfo.Id.NONE)
public abstract class UserMixin {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("firstName")
    private String firstName;
    @JsonProperty("lastName")
    private String lastName;
    @JsonProperty("userName")
    private String userName;
    @JsonProperty("email")
    private String email;
    @JsonIgnore
    private String password;
    @JsonIgnore
    private String verificationCode;
    @JsonProperty("enabled")
    private boolean enabled;
    @JsonIgnore
    private Set<Role> roles = new HashSet<>();
    @JsonIgnore
    private List<Dashboard> dashboards = new ArrayList<Dashboard>();
}
