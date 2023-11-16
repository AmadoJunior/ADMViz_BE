package com.adm.cruddemo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "charts_positions")
public class ChartPosition {
    @Id
    @GeneratedValue
    int id;
    @Column(name="x")
    int x;
    @Column(name="y")
    int y;
    @Column(name="w")
    int w;
    @Column(name="h")
    int h;
    @OneToOne(fetch = FetchType.LAZY)
    Chart chart;

    //Constructors
    public ChartPosition() {
    }
    public ChartPosition(int x, int y, int w, int h, Chart chart) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.chart = chart;
    }

    //Getters & Setters

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getX() {
        return x;
    }
    public void setX(int x) {
        this.x = x;
    }
    public int getY() {
        return y;
    }
    public void setY(int y) {
        this.y = y;
    }
    public int getW() {
        return w;
    }
    public void setW(int w) {
        this.w = w;
    }
    public int getH() {
        return h;
    }
    public void setH(int h) {
        this.h = h;
    }
    public Chart getChart() {
        return chart;
    }
    public void setChart(Chart chart) {
        this.chart = chart;
    }
}
