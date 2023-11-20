package com.adm.cruddemo.controller;

import com.adm.cruddemo.DTO.Login;
import com.adm.cruddemo.DTO.Register;
import com.adm.cruddemo.entity.Role;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.repository.RoleRepo;
import com.adm.cruddemo.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.BasePathAwareController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private RoleRepo roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/perform_login")
    public ResponseEntity<String> authenticateUser(@RequestBody Login loginDTO) {
        System.out.println("RAN LOGIN");
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginDTO.getUserName(), loginDTO.getPassword());
        Authentication authentication = authenticationManager.authenticate(authToken);
        if(authentication.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return new ResponseEntity<>(HttpStatus.OK.getReasonPhrase(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
    }
    @GetMapping("/self")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal UserDetails userDetails) {
        if(userDetails == null){
            logger.debug("User Details Not Found");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<UserDetails>(
                userDetails, HttpStatus.OK
        );
    }
    @Transactional
    @PostMapping("/perform_register")
    public ResponseEntity<?> registerUser(@RequestBody Register registerDTO){
        //Check Dup Username
        if(userRepository.findByUserName(registerDTO.getUserName()).isPresent()){
            logger.debug("Duplicate User Name Found");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        //Check Dup Email
        if(userRepository.findByUserEmail(registerDTO.getEmail()).isPresent()){
            logger.debug("Duplicate Email Found");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }

        //Encode Password
        logger.debug("Password: " + registerDTO.toString());
        String encodedPassword = passwordEncoder.encode(registerDTO.getPassword());

        //Define Role
        Role userRole = roleRepository.findRoleByName("ROLE_USER");

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
        User savedUser = userRepository.save(newUser);

        logger.debug("User Successfully Created: " + savedUser.getId());

        return new ResponseEntity<>(HttpStatus.CREATED.getReasonPhrase(), HttpStatus.CREATED);
    }
}
