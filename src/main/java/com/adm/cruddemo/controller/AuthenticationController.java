package com.adm.cruddemo.controller;

import com.adm.cruddemo.DTO.Register;
import com.adm.cruddemo.entity.Role;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.service.AuthenticationService;
import com.adm.cruddemo.service.CustomUserDetails;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;
    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @GetMapping("/self")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if(userDetails == null){
            logger.debug("User Details Not Found");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
        userDetails.eraseCredentials();
        return new ResponseEntity<UserDetails>(
                userDetails, HttpStatus.OK
        );
    }
    @Transactional
    @PostMapping("/perform_register")
    public ResponseEntity<?> registerUser(@RequestBody Register registerDTO){
        if(authenticationService.isDuplicateUser(registerDTO.getUserName(), registerDTO.getEmail())){
            logger.debug("Duplicate User Found");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        if(authenticationService.isInvalidEmail(registerDTO.getEmail())){
            logger.debug("Invalid Email");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        if(authenticationService.isInvalidPassword(registerDTO.getPassword())){
            logger.debug("Invalid Password");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        String encodedPassword = authenticationService.encodePassword(registerDTO.getPassword());

        //Define Role
        Role userRole = authenticationService.getDefaultRole();

        //Create User
        User newUser = new User();
        newUser.setFirstName(registerDTO.getFirstName());
        newUser.setLastName(registerDTO.getLastName());
        newUser.setUserName(registerDTO.getUserName());
        newUser.setEmail(registerDTO.getEmail());
        newUser.setPassword(encodedPassword);
        newUser.setEnabled(true);
        newUser.addRole(userRole);

        //Save
        User savedUser = authenticationService.createUser(newUser);
        if(savedUser == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        logger.debug("User Successfully Created: " + savedUser.getId());
        return new ResponseEntity<>(HttpStatus.CREATED.getReasonPhrase(), HttpStatus.CREATED);
    }
}
