package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface RoleRepo extends CrudRepository<Role, Integer> {
    @Query("SELECT r FROM Role r WHERE r.name = :roleName")
    public Role findRoleByName(@Param("roleName") String roleName);
}
