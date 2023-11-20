package com.adm.cruddemo.entity;

import jakarta.persistence.*;
import java.util.List;
@Entity
@Table(name = "dashboards")
public class Dashboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name="name", nullable = false)
    private String name;
    @OneToMany(mappedBy = "dashboard", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Chart> charts;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    //Methods
    public void addChart(Chart chart) {
        this.charts.add(chart);
        chart.setDashboard(this);
        chart.setUser(this.user);
    }

    public void removeChart(Chart chart) {
        this.charts.remove(chart);
        chart.setDashboard(null);
    }

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
