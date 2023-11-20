package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.ChartPosition;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

@RepositoryRestResource(path="chart_positions")
@PreAuthorize("hasRole('ROLE_USER')")
public interface ChartPositionRepo extends CrudRepository<ChartPosition, Integer> {
}
