package com.adm.cruddemo.rest;

import com.adm.cruddemo.entity.UserEntity;
import com.adm.cruddemo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserRequestController {
    UserRepo userRepo;

    @Autowired
    public UserRequestController(UserRepo userRepo){
        this.userRepo = userRepo;
    }

    @GetMapping("/users")
    public List<UserEntity> getUsers(){
        List<UserEntity> users = userRepo.getAllUsers();
        if(users.isEmpty()) {
            throw new UserNotFoundException("No Users Found");
        }
        return users;
    }

    @GetMapping("/users/{userId}")
    public UserEntity getUser(@PathVariable int userId){
        UserEntity foundUser = userRepo.findById(userId);
        if(foundUser == null) {
            throw new UserNotFoundException("User Not Found: " + userId);
        }
        return foundUser;
    }

    @PostMapping("/users")
    public void createUser(@RequestBody UserEntity newUser){
        userRepo.save(newUser);
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable int userId){
        UserEntity foundUser = userRepo.findById(userId);
        if(foundUser == null) {
            throw new UserNotFoundException("User Not Found: " + userId);
        }
        userRepo.remove(foundUser);
    }

    @PutMapping("/users")
    public void updateUser(@RequestBody UserEntity updatedUser){
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
