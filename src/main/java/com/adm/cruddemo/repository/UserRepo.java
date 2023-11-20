package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PreFilter;

import java.util.Optional;

@RepositoryRestResource(path="users")
public interface UserRepo extends CrudRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.userName = :userName")
    @PreAuthorize("#userName == authentication.name")
    public Optional<User> findByUserName(@Param("userName") String userName);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    public Optional<User> findByUserEmail(@Param("email") String email);
    @PreAuthorize("#userId == @userService.findByUserName(authentication.name).getId()")
    @Override
    Optional<User> findById(Integer userId);
}
