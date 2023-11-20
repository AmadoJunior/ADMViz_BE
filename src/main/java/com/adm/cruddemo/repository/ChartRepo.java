package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Collection;
import java.util.Optional;

@RepositoryRestResource(path="charts")
public interface ChartRepo extends CrudRepository<Chart, Integer> {
    @PostAuthorize("hasRole('ROLE_ADMIN') || returnObject.get().user.getId() == authentication.principal.getId()")
    @Override
    Optional<Chart> findById(Integer chartId);
    @RestResource(exported = false)
    @Query("SELECT c FROM Chart c WHERE c.name = :chartName")
    public Chart findByChartName(@Param("chartName") String chartName);
    @RestResource(exported = false)
    @Override
    <S extends Chart> S save(S entity);
    @RestResource(exported = false)
    @Override
    <S extends Chart> Iterable<S> saveAll(Iterable<S> entities);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    boolean existsById(Integer integer);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<Chart> findAll();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<Chart> findAllById(Iterable<Integer> integers);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    long count();
    @RestResource(exported = false)
    @Override
    void deleteById(Integer integer);
    @RestResource(exported = false)
    @Override
    void delete(Chart entity);
    @RestResource(exported = false)
    @Override
    void deleteAllById(Iterable<? extends Integer> integers);
    @RestResource(exported = false)
    @Override
    void deleteAll(Iterable<? extends Chart> entities);
    @RestResource(exported = false)
    @Override
    void deleteAll();
}
