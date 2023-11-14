package com.adm.cruddemo.service;

import com.adm.cruddemo.entity.UserEntity;
import com.adm.cruddemo.repository.UserRepo;

import java.util.List;

public interface IUserService {
    List<UserEntity> findAll();
    UserEntity findById(int userId);
    void createUser(UserEntity newUser);
    void deleteUser(int userId);
    void updateUser(UserEntity updatedUser);
}
