package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Dashboard;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

@RepositoryRestResource(path="dashboards")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface DashboardRepo extends CrudRepository<Dashboard, Integer> {
    @Override
    @PreAuthorize("hasRole('ROLE_USER')")
    Optional<Dashboard> findById(Integer integer);
}
