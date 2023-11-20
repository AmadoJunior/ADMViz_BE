package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

@RepositoryRestResource(path="users")
public interface UserRepo extends CrudRepository<User, Integer> {
    @RestResource(exported = false)
    @Query("SELECT u FROM User u WHERE u.userName = :userName")
    public Optional<User> findByUserName(@Param("userName") String userName);
    @RestResource(exported = false)
    @Query("SELECT u FROM User u WHERE u.email = :email")
    public Optional<User> findByUserEmail(@Param("email") String email);
    @PreAuthorize("hasRole('ROLE_ADMIN') || #userId == authentication.principal.getId()")
    @Override
    Optional<User> findById(Integer userId);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    <S extends User> S save(S entity);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    <S extends User> Iterable<S> saveAll(Iterable<S> entities);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    boolean existsById(Integer integer);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<User> findAll();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<User> findAllById(Iterable<Integer> integers);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    long count();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteById(Integer integer);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void delete(User entity);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteAllById(Iterable<? extends Integer> integers);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteAll(Iterable<? extends User> entities);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    void deleteAll();
}
