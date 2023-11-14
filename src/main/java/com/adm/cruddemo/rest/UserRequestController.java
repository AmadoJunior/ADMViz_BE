package com.adm.cruddemo.rest;

import com.adm.cruddemo.entity.UserEntity;
import com.adm.cruddemo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return userRepo.getAllUsers();
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
        try{
            userRepo.save(newUser);
        } catch(RuntimeException exception){
            System.out.println("Dup Exc" + exception.getClass());
            throw new DuplicateUserException("Bad Request");
        }

    }

    @ExceptionHandler({
        UserNotFoundException.class
    })
    public ResponseEntity<ErrorResponse> handleNotFoundException(UserNotFoundException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(404);
        error.setMessage(exception.getMessage());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({
        DuplicateUserException.class
    })
    public ResponseEntity<ErrorResponse> handleDuplicateException(DuplicateUserException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(400);
        error.setMessage(exception.getMessage());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST);
    }
}
