package com.adm.cruddemo.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "charts_positions")
public class ChartPosition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="x")
    private int x;
    @Column(name="y")
    private int y;
    @Column(name="w")
    private int w;
    @Column(name="h")
    private int h;

    //Constructors
    public ChartPosition(int x, int y, int w, int h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
