package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Chart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="charts")
public interface ChartRepo extends JpaRepository<Chart, Integer> {
}
