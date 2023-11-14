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

    @GetMapping("/user/{studentId}")
    public UserEntity getUser(@PathVariable int studentId){
        UserEntity foundUser = userRepo.findById(studentId);
        if(foundUser == null) {
            throw new UserNotFoundException("User Not Found: " + studentId);
        }
        return foundUser;
    }

    @PostMapping("/user")
    public void createUser(@RequestBody UserEntity newUser){
        userRepo.save(newUser);
    }
}
