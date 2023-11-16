package com.adm.cruddemo.entity;

import jakarta.persistence.*;

import java.util.Collection;

@Entity
@Table(name="roles")
public class Role {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "name")
    private String name;

    //Constructors
    public Role() {
    }
    public Role(String name) {
        this.name = name;
    }

    //Setters & Getters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}