package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.ChartPosition;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource(path="charts_positions")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface ChartPositionRepo extends CrudRepository<ChartPosition, Integer> {
}
