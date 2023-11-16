package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="dashboards")
public interface DashboardRepo extends JpaRepository<Dashboard, Integer> {
}
