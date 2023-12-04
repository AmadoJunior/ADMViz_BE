package com.adm.cruddemo.service;

import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.repository.RoleRepo;
import com.adm.cruddemo.repository.UserRepo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepo userRepository;
    @Mock
    private RoleRepo roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private AuthenticationService authenticationService;


    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void isDuplicateUser() {
        String userName = "testUser";
        String email = "test@example.com";

        Mockito.when(userRepository.findByUserName(userName)).thenReturn(Optional.empty());
        Mockito.when(userRepository.findByUserEmail(email)).thenReturn(Optional.of(new User()));

        assertTrue(
                authenticationService.isDuplicateUser(userName, email)
        );
    }

    @Test
    void isValidPassword() {
    }

    @Test
    void isValidEmail() {
    }

    @Test
    void createUser() {
    }

    @Test
    void verifyUser() {
    }

    @Test
    void sendVerificationEmail() {
    }
}