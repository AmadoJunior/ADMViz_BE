package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource(path="charts")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface ChartRepo extends CrudRepository<Chart, Integer> {
    @Query("SELECT c FROM Chart c WHERE c.name = :chartName")
    public Chart findByChartName(@Param("chartName") String chartName);
}
