package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Dashboard;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Collection;
import java.util.Optional;

@RepositoryRestResource(path="dashboards")
@PreAuthorize("hasRole('ROLE_USER')")
public interface DashboardRepo extends CrudRepository<Dashboard, Integer> {
    @Override
    @PreAuthorize("hasRole('ROLE_USER')")
    Optional<Dashboard> findById(Integer id);

//    @PreAuthorize("hasRole('ROLE_USER')")
//    @Query("SELECT d FROM Dashboard d WHERE d.user_id = :userId")
//    Collection<Dashboard> findByUserId(@Param("userId")Integer userId);
//
//    @PreAuthorize("hasRole('ROLE_USER')")
//    @Query("SELECT d FROM Dashboard d WHERE d.user_id = :userId AND d.id = :dashboardId")
//    Optional<Dashboard> findByUserId(@Param("userId")Integer userId, @Param("dashboardId") Integer dashboardId);
}
