package com.adm.cruddemo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "charts")
public class Chart {
    @Id
    @GeneratedValue
    int id;
    @Column(name="name", nullable = false)
    String name;
    @Column(name="src_url")
    String srcUrl;
    @Column(name="data_key")
    String dataKey;
    @Column(name="label_key")
    String labelKey;
    @Column(name="chart_type")
    String chartType;
    @Column(name="method")
    String method;
    @Column(name="api_key")
    String apiKey;
    @Column(name="from_date")
    int fromDate;
    @Column(name="to_date")
    int toDate;
    @OneToOne(fetch = FetchType.EAGER)
    ChartPosition position;
    @ManyToOne(fetch = FetchType.LAZY)
    Dashboard dashboard;

    //Constructors
    public Chart() {
    }
    public Chart(String name, String srcUrl, String dataKey, String labelKey, String chartType, String method, String apiKey, int fromDate, int toDate, ChartPosition position, Dashboard dashboard) {
        this.name = name;
        this.srcUrl = srcUrl;
        this.dataKey = dataKey;
        this.labelKey = labelKey;
        this.chartType = chartType;
        this.method = method;
        this.apiKey = apiKey;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.position = position;
        this.dashboard = dashboard;
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
    public String getSrcUrl() {
        return srcUrl;
    }
    public void setSrcUrl(String srcUrl) {
        this.srcUrl = srcUrl;
    }
    public String getDataKey() {
        return dataKey;
    }
    public void setDataKey(String dataKey) {
        this.dataKey = dataKey;
    }
    public String getLabelKey() {
        return labelKey;
    }
    public void setLabelKey(String labelKey) {
        this.labelKey = labelKey;
    }
    public String getChartType() {
        return chartType;
    }
    public void setChartType(String chartType) {
        this.chartType = chartType;
    }
    public String getMethod() {
        return method;
    }
    public void setMethod(String method) {
        this.method = method;
    }
    public String getApiKey() {
        return apiKey;
    }
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    public int getFromDate() {
        return fromDate;
    }
    public void setFromDate(int fromDate) {
        this.fromDate = fromDate;
    }
    public int getToDate() {
        return toDate;
    }
    public void setToDate(int toDate) {
        this.toDate = toDate;
    }
    public ChartPosition getPosition() {
        return position;
    }
    public void setPosition(ChartPosition position) {
        this.position = position;
    }
    public Dashboard getDashboard() {
        return dashboard;
    }
    public void setDashboard(Dashboard dashboard) {
        this.dashboard = dashboard;
    }
}
