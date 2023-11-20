package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Dashboard;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

@RepositoryRestResource(path="dashboards")

public interface DashboardRepo extends CrudRepository<Dashboard, Integer> {
    @PostAuthorize("hasRole('ROLE_ADMIN') || returnObject.get().user.getId() == authentication.principal.getId()")
    @Override
    Optional<Dashboard> findById(Integer dashboardId);
    @RestResource(exported = false)
    @Override
    <S extends Dashboard> S save(S entity);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<Dashboard> findAll();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<Dashboard> findAllById(Iterable<Integer> integers);
    @RestResource(exported = false)
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
    @RestResource(exported = false)
    @Override
    void delete(Dashboard entity);
    @RestResource(exported = false)
    @Override
    void deleteAllById(Iterable<? extends Integer> integers);
    @RestResource(exported = false)
    @Override
    void deleteAll(Iterable<? extends Dashboard> entities);
    @RestResource(exported = false)
    @Override
    void deleteAll();
}
