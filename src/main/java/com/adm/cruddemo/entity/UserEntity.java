package com.adm.cruddemo.entity;

import io.micrometer.common.lang.NonNull;
import jakarta.persistence.*;

@Entity
@Table(name="user")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="first_name", nullable = false)
    private String firstName;
    @Column(name="last_name", nullable = false)
    private String lastName;
    @Column(name="email", unique = true, nullable = false)
    private String email;
    @Column(name="hash", nullable = false)
    private String hash;

    public UserEntity(){}

    public UserEntity(String firstName, String lastName, String email, String hash) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hash = hash;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }
}
