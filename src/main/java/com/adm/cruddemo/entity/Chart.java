package com.adm.cruddemo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
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
    @Column(name="order_value")
    private String order;
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

    //Constructor
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
}
