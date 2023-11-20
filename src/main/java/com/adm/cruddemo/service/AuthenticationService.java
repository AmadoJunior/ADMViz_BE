package com.adm.cruddemo.service;

import com.adm.cruddemo.controller.AuthenticationController;
import com.adm.cruddemo.entity.Role;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.repository.RoleRepo;
import com.adm.cruddemo.repository.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private RoleRepo roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    public boolean isDuplicateUser(String userName, String email) {
        return userRepository.findByUserName(userName).isPresent() || userRepository.findByUserEmail(email).isPresent();
    }

    public boolean isInvalidPassword(String password) {
        return password.length() < 6;
    }

    public boolean isInvalidEmail(String email) {
        return email.length() < 8;
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public Role getDefaultRole() {
        return roleRepository.findRoleByName("ROLE_USER");
    }

    public User createUser(User newUser) {
        return userRepository.save(newUser);
    }
}
