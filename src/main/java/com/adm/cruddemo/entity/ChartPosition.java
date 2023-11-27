package com.adm.cruddemo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "charts_positions")
public class ChartPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty( "id" )
    private int id;
    @Column(name="x")
    private int x;
    @Column(name="y")
    private int y;
    @Column(name="w")
    private int w;
    @Column(name="h")
    private int h;
    @OneToOne(fetch = FetchType.LAZY)
    private Chart chart;

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
