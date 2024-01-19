package com.adm.cruddemo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "dashboards")
public class Dashboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty( "id" )
    private Long id;
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
        chart.setUser(null);
    }

    //Constructors
    public Dashboard(String name, List<Chart> charts, User user) {
        this.name = name;
        this.charts = charts;
        this.user = user;
    }
}
