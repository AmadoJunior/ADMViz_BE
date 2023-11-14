package com.adm.cruddemo.service;

import com.adm.cruddemo.entity.UserEntity;
import com.adm.cruddemo.repository.UserRepo;
import com.adm.cruddemo.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

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
        users = userRepo.getAllUsers();
        if(users.isEmpty()) {
            throw new UserNotFoundException("No Users Found");
        }
        return users;
    }

    @Override
    public UserEntity findById(int userId) {
        UserEntity foundUser = userRepo.findById(userId);
        if(foundUser == null) {
            throw new UserNotFoundException("User Not Found: " + userId);
        }
        return foundUser;
    }

    @Override
    public void createUser(UserEntity newUser) {
        userRepo.save(newUser);
    }

    @Override
    public void deleteUser(int userId) {
        UserEntity foundUser = userRepo.findById(userId);
        if(foundUser == null) {
            throw new UserNotFoundException("User Not Found: " + userId);
        }
        userRepo.remove(foundUser);
    }

    @Override
    public void updateUser(UserEntity updatedUser) {
        UserEntity foundUser = userRepo.findById(updatedUser.getId());
        if(foundUser == null) {
            throw new UserNotFoundException("User Not Found: " + updatedUser.getId());
        }
        if(
                updatedUser.getEmail() == null ||
                        updatedUser.getFirstName() == null ||
                        updatedUser.getLastName() == null ||
                        updatedUser.getHash() == null
        ) {
            throw new DataIntegrityViolationException("Invalid Inputs");
        } else {
            foundUser.setEmail(updatedUser.getEmail());
            foundUser.setFirstName(updatedUser.getFirstName());
            foundUser.setLastName(updatedUser.getLastName());
            foundUser.setHash(updatedUser.getHash());
        }

        userRepo.update(updatedUser);
    }
}
