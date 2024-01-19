package com.adm.cruddemo.entity;

import jakarta.persistence.*;
import lombok.Builder;

import java.util.Collection;

@Entity
@Builder
@Table(name="roles")
public class Role {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;

    //Constructors
    public Role() {
    }
    public Role(String name) {
        this.name = name;
    }

    //Setters & Getters
    public long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}