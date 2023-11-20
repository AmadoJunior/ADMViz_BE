package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Collection;
import java.util.Optional;

@RepositoryRestResource(path="charts")
@PreAuthorize("hasRole('ROLE_USER')")
public interface ChartRepo extends CrudRepository<Chart, Integer> {
    @Query("SELECT c FROM Chart c WHERE c.name = :chartName")
    public Chart findByChartName(@Param("chartName") String chartName);

//    @PreAuthorize("hasRole('ROLE_USER')")
//    @Query("SELECT c FROM Chart c WHERE c.dashboard_id = :dashboardId")
//    Collection<Chart> findByDashboardId(@Param("dashboardId")Integer dashboardId);
}
