package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Dashboard;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

@RepositoryRestResource(path="dashboards")

public interface DashboardRepo extends CrudRepository<Dashboard, Integer> {
    @PostAuthorize("hasRole('ROLE_ADMIN') || returnObject.get().user.getId() == authentication.principal.getId()")
    @Override
    Optional<Dashboard> findById(Integer dashboardId);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    <S extends Dashboard> S save(S entity);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<Dashboard> findAll();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<Dashboard> findAllById(Iterable<Integer> integers);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    <S extends Dashboard> Iterable<S> saveAll(Iterable<S> entities);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    boolean existsById(Integer integer);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    long count();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteById(Integer integer);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void delete(Dashboard entity);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteAllById(Iterable<? extends Integer> integers);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteAll(Iterable<? extends Dashboard> entities);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteAll();
}
