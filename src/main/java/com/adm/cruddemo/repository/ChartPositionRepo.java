package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.ChartPosition;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ChartPositionRepo extends CrudRepository<ChartPosition, Long> {
    @RestResource(exported = false)
    @Override
    <S extends ChartPosition> S save(S entity);
    @RestResource(exported = false)
    @Override
    <S extends ChartPosition> Iterable<S> saveAll(Iterable<S> entities);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Optional<ChartPosition> findById(Long chartPosId);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    boolean existsById(Long chartPosId);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<ChartPosition> findAll();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<ChartPosition> findAllById(Iterable<Long> chartPosIds);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    long count();
    @RestResource(exported = false)
    @Override
    void deleteById(Long chartPosId);
    @RestResource(exported = false)
    @Override
    void delete(ChartPosition entity);
    @RestResource(exported = false)
    @Override
    void deleteAllById(Iterable<? extends Long> chartPosIds);
    @RestResource(exported = false)
    @Override
    void deleteAll(Iterable<? extends ChartPosition> entities);
    @RestResource(exported = false)
    @Override
    void deleteAll();
}
