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
public interface UserRepo extends CrudRepository<User, Long> {
    @PreAuthorize("hasRole('ROLE_ADMIN') || #userId == authentication.principal.getId()")
    @Override
    Optional<User> findById(Long userId);
    @RestResource(exported = false)
    @Query("SELECT u FROM User u WHERE u.userName = :userName")
    public Optional<User> findByUserName(@Param("userName") String userName);
    @RestResource(exported = false)
    @Query("SELECT u FROM User u WHERE u.userName = :userName OR u.email = :userName")
    public Optional<User> findByUsernameOrEmail(@Param("userName") String userName);
    @RestResource(exported = false)
    @Query("SELECT u FROM User u WHERE u.verificationCode = :verificationCode")
    public Optional<User> findByVerificaitonCode(@Param("verificationCode") String verificationCode);
    @RestResource(exported = false)
    @Query("SELECT u FROM User u WHERE u.email = :email")
    public Optional<User> findByUserEmail(@Param("email") String email);
    @RestResource(exported = false)
    @Override
    <S extends User> S save(S entity);
    @RestResource(exported = false)
    @Override
    <S extends User> Iterable<S> saveAll(Iterable<S> entities);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    boolean existsById(Long userId);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<User> findAll();
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    Iterable<User> findAllById(Iterable<Long> userIds);
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Override
    long count();
    @RestResource(exported = false)
    @Override
    void deleteById(Long userId);
    @RestResource(exported = false)
    @Override
    void delete(User entity);
    @RestResource(exported = false)
    @Override
    void deleteAllById(Iterable<? extends Long> userIds);
    @RestResource(exported = false)
    @Override
    void deleteAll(Iterable<? extends User> entities);
    @RestResource(exported = false)
    @Override
    void deleteAll();
}
