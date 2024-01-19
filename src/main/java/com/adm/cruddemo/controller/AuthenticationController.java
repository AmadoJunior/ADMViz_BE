package com.adm.cruddemo.controller;

import com.adm.cruddemo.DTO.Register;
import com.adm.cruddemo.entity.Role;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.service.AuthenticationService;
import com.adm.cruddemo.service.CaptchaService;
import com.adm.cruddemo.service.CustomUserDetails;
import jakarta.mail.MessagingException;
import jakarta.persistence.Cacheable;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    CaptchaService captchaService;
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
    public ResponseEntity<?> registerUser(@RequestBody Register registerDTO) throws UnsupportedEncodingException, MessagingException {
        try {
            captchaService.processToken(registerDTO.getToken());
            logger.debug(registerDTO.getToken());
        } catch (RuntimeException e) {
            logger.debug("Invalid Token");
            logger.debug(e.toString());
            return new ResponseEntity<>(HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase(), HttpStatus.SERVICE_UNAVAILABLE);
        }

        if(authenticationService.isDuplicateUser(registerDTO.getUserName(), registerDTO.getEmail())){
            logger.debug("Duplicate User Found");
            return new ResponseEntity<>(HttpStatus.CONFLICT.getReasonPhrase(), HttpStatus.CONFLICT);
        }

        if(!authenticationService.isValidEmail(registerDTO.getEmail())){
            logger.debug("Invalid Email");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        if(!authenticationService.isValidPassword(registerDTO.getPassword())){
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
        newUser.addRole(userRole);

        //Verification
        UUID randomCode = UUID.randomUUID();
        newUser.setVerificationCode(randomCode.toString());
        newUser.setEnabled(false);

        //Save
        User savedUser = authenticationService.createUser(newUser);
        if(savedUser == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        authenticationService.sendVerificationEmail(savedUser, "http://localhost:8080/");

        logger.debug("User Successfully Created: " + savedUser.getId());
        return new ResponseEntity<>(HttpStatus.CREATED.getReasonPhrase(), HttpStatus.CREATED);
    }

    @Transactional
    @GetMapping("/perform_verify")
    public ResponseEntity<?> verifyUser(@RequestParam String code){
        Optional<User> verifiedUser = authenticationService.verifyUser(code);

        if(verifiedUser.isPresent()){
            logger.debug("User Successfully Identified: " + verifiedUser.get().getEmail());
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("http://localhost:3000")).build();
        }

        logger.debug("User Failed Email Identification: " + code);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
    }
}
