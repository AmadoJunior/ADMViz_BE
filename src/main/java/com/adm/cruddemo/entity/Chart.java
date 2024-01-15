package com.adm.cruddemo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "charts")
public class Chart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty( "id" )
    private Long id;
    @Column(name="name", nullable = false)
    private String name;
    @Column(name="src_url")
    private String srcUrl;
    @Column(name="data_key")
    private String dataKey;
    @Column(name="label_key")
    private String labelKey;
    @Column(name="chart_type")
    private String chartType;
    @Column(name="method")
    private String method;
    @Column(name="select_value")
    private String select;
    @Column(name="where_value")
    private String where;
    @Column(name="group_value")
    private String group;
    @Column(name="limit_value")
    private String limit;
    @Column(name="from_date")
    private Long fromDate;
    @Column(name="to_date")
    private Long toDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dashboard_id", referencedColumnName = "id")
    private Dashboard dashboard;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "position_id", referencedColumnName = "id")
    @JsonManagedReference
    private ChartPosition position;

    //Methods
    public void addPosition(ChartPosition position){
        this.position = position;
    }

    public void removePosition(ChartPosition position){
        this.position = null;
    }

    //Constructors
    public Chart() {
    }
    public Chart(String name, String srcUrl, String dataKey, String labelKey, String chartType, String method, String select, String where, String group, String limit, long fromDate, long toDate, ChartPosition position, Dashboard dashboard, User user) {
        this.name = name;
        this.srcUrl = srcUrl;
        this.dataKey = dataKey;
        this.labelKey = labelKey;
        this.chartType = chartType;
        this.method = method;
        this.select = select;
        this.where = where;
        this.group = group;
        this.limit = limit;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.position = position;
        this.dashboard = dashboard;
        this.user = user;
    }

    //Getters & Setters
    public Long getId() {
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

    public String getSelect() {
        return select;
    }

    public void setSelect(String select) {
        this.select = select;
    }

    public String getWhere() {
        return where;
    }

    public void setWhere(String where) {
        this.where = where;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getLimit() {
        return limit;
    }

    public void setLimit(String limit) {
        this.limit = limit;
    }

    public Long getFromDate() {
        return fromDate;
    }
    public void setFromDate(Long fromDate) {
        this.fromDate = fromDate;
    }
    public Long getToDate() {
        return toDate;
    }
    public void setToDate(Long toDate) {
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
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}
