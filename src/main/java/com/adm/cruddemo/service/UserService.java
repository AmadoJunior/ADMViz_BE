package com.adm.cruddemo.service;

import com.adm.cruddemo.entity.UserEntity;
import com.adm.cruddemo.exception.UserNotFoundException;
import com.adm.cruddemo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {
    UserRepo userRepo;
    @Autowired
    public UserService(UserRepo userRepo){
        this.userRepo = userRepo;
    }

    @Override
    public List<UserEntity> findAll() {
        List<UserEntity> users;
        users = userRepo.findAll();
        if(users.isEmpty()) {
            throw new UserNotFoundException("No Users Found");
        }
        return users;
    }

    @Override
    public UserEntity findById(int userId) {
        Optional<UserEntity> foundUser = userRepo.findById(userId);

        if(foundUser.isPresent()) {
            return foundUser.get();
        }

        throw new UserNotFoundException("User Not Found: " + userId);
    }

    @Override
    @Transactional
    public void createUser(UserEntity newUser) {
        userRepo.save(newUser);
    }

    @Override
    @Transactional
    public void deleteUser(int userId) {
        Optional<UserEntity> foundUser = userRepo.findById(userId);
        if(foundUser.isPresent()) {
            userRepo.delete(foundUser.get());
        } else {
            throw new UserNotFoundException("User Not Found: " + userId);
        }
    }

    @Override
    @Transactional
    public void updateUser(UserEntity updatedUser) {
        userRepo.save(updatedUser);
    }
}
