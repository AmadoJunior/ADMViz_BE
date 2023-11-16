package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.ChartPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="charts_positions")
public interface ChartPositionRepo extends JpaRepository<ChartPosition, Integer> {
}
