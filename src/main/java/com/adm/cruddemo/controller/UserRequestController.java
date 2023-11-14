package com.adm.cruddemo.controller;

import com.adm.cruddemo.entity.UserEntity;
import com.adm.cruddemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserRequestController {
    UserService userService;

    @Autowired
    public UserRequestController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<UserEntity> getUsers(){
        return userService.findAll();
    }

    @GetMapping("/users/{userId}")
    public UserEntity getUser(@PathVariable int userId){
        return userService.findById((userId));
    }

    @PostMapping("/users")
    public void createUser(@RequestBody UserEntity newUser){
        userService.createUser(newUser);
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable int userId){
        userService.deleteUser(userId);
    }

    @PutMapping("/users")
    public void updateUser(@RequestBody UserEntity updatedUser){
        userService.updateUser(updatedUser);
    }
}
