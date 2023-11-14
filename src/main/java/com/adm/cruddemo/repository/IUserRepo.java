package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.UserEntity;

import java.util.List;

public interface IUserRepo {

    void save(UserEntity user);

    void update(UserEntity user);

    void remove(int id);

    UserEntity findById(int id);

    List<UserEntity> getAllUsers();

    List<UserEntity> findByFirstName(String firstName);


}
