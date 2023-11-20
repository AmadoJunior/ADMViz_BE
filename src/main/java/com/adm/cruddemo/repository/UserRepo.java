package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface UserRepo extends CrudRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.userName = :userName")
    public Optional<User> findByUserName(@Param("userName") String userName);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    public Optional<User> findByUserEmail(@Param("email") String email);
}
