package com.adm.cruddemo.entity;

import jakarta.persistence.*;

import java.util.List;
@Entity
@Table(name = "dashboards")
public class Dashboard {
    @Id
    @GeneratedValue
    int id;
    @Column(name="name", nullable = false)
    String name;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    List<Chart> charts;
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private User user;

    //Constructors
    public Dashboard() {
    }
    public Dashboard(String name, List<Chart> charts, User user) {
        this.name = name;
        this.charts = charts;
        this.user = user;
    }

    //Getters & Setters
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
    public List<Chart> getCharts() {
        return charts;
    }
    public void setCharts(List<Chart> charts) {
        this.charts = charts;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}
