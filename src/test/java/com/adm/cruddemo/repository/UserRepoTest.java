package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import java.util.Optional;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepoTest {
    @Autowired
    private UserRepo userRepo;

    private static final String MOCK_USER_NAME = "test";
    private static final String MOCK_USER_EMAIL = "test@gmail.com";
    private static final String MOCK_USER_PASS = "pass";

    @Test
    public void Query_findByUserName_ReturnsFoundUser() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        //Act
        Optional<User> foundUser = userRepo.findByUserName(MOCK_USER_NAME);

        //Assert
        Assertions.assertTrue(foundUser.isPresent());
        Assertions.assertEquals(foundUser.get().getId(), mockUser.getId());
    }

    @Test
    public void Query_findByUserName_ReturnsUserNotFound() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        //Act
        Optional<User> foundUser = userRepo.findByUserName("NonExistentUser");

        //Assert
        Assertions.assertTrue(foundUser.isEmpty());
    }

    @Test
    public void Query_findByUsernameOrEmail_ReturnsFoundUser() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        //Act
        Optional<User> foundUserByUsername = userRepo.findByUsernameOrEmail(MOCK_USER_NAME);
        Optional<User> foundUserByEmail = userRepo.findByUsernameOrEmail(MOCK_USER_EMAIL);

        //Assert by Username
        Assertions.assertTrue(foundUserByUsername.isPresent());
        Assertions.assertEquals(foundUserByUsername.get().getId(), mockUser.getId());

        //Assert by Email
        Assertions.assertTrue(foundUserByEmail.isPresent());
        Assertions.assertEquals(foundUserByEmail.get().getId(), mockUser.getId());

        Assertions.assertSame(foundUserByUsername.get(), foundUserByEmail.get());
    }

    @Test
    public void Query_findByUsernameOrEmail_ReturnsUserNotFound() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        //Act
        Optional<User> foundUserByUsername = userRepo.findByUsernameOrEmail("NonExistentUser");
        Optional<User> foundUserByEmail = userRepo.findByUsernameOrEmail("NonExistentEmail");

        //Assert by Username
        Assertions.assertTrue(foundUserByUsername.isEmpty());

        //Assert by Email
        Assertions.assertTrue(foundUserByEmail.isEmpty());
    }

    @Test
    public void Query_findByVerificaitonCode_ReturnsFoundUser() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        //Act
        Optional<User> foundUser = userRepo.findByUserName(MOCK_USER_NAME);

        //Assert
        Assertions.assertTrue(foundUser.isPresent());
        Assertions.assertEquals(foundUser.get().getId(), mockUser.getId());
    }
}
