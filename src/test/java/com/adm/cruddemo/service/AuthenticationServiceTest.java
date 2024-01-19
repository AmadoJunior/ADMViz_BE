package com.adm.cruddemo.service;

import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.repository.RoleRepo;
import com.adm.cruddemo.repository.UserRepo;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

@ActiveProfiles("test")
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

    private static final String MOCK_USER_NAME = "test";
    private static final String MOCK_USER_EMAIL = "test@gmail.com";
    private static final String MOCK_USER_PASS = "pass";

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
        Mockito.reset(userRepository);
    }

    @Test
    void isDuplicateUser_FindsUserEmail() {
        Mockito.when(userRepository.findByUserName(MOCK_USER_NAME)).thenReturn(Optional.empty());
        Mockito.when(userRepository.findByUserEmail(MOCK_USER_EMAIL)).thenReturn(Optional.of(new User()));

        assertTrue(
                authenticationService.isDuplicateUser(MOCK_USER_NAME, MOCK_USER_EMAIL)
        );
    }
    @Test
    void isDuplicateUser_FindsUserName() {
        Mockito.when(userRepository.findByUserEmail(MOCK_USER_EMAIL)).thenReturn(Optional.empty());
        Mockito.when(userRepository.findByUserName(MOCK_USER_NAME)).thenReturn(Optional.of(new User()));

        assertTrue(
                authenticationService.isDuplicateUser(MOCK_USER_NAME, MOCK_USER_EMAIL)
        );
    }
    @Test
    void isDuplicateUser_DuplicateNotFound() {
        Mockito.when(userRepository.findByUserEmail(MOCK_USER_EMAIL)).thenReturn(Optional.empty());
        Mockito.when(userRepository.findByUserName(MOCK_USER_NAME)).thenReturn(Optional.empty());

        assertFalse(
                authenticationService.isDuplicateUser(MOCK_USER_NAME, MOCK_USER_EMAIL)
        );
    }

    @Test
    void isValidPassword_ValidPassword() {
        final String validPass = "Admbuild*123";
        assertTrue(authenticationService.isValidPassword((validPass)));
    }
    @Test
    void isValidPassword_InvalidPasswordShort() {
        final String validPass = "Adm*1";
        assertFalse(authenticationService.isValidPassword((validPass)));
    }
    @Test
    void isValidPassword_InvalidPasswordSymbol() {
        final String validPass = "Admbuild123";
        assertFalse(authenticationService.isValidPassword((validPass)));
    }
    @Test
    void isValidPassword_InvalidPasswordCapital() {
        final String validPass = "admbuild*123";
        assertFalse(authenticationService.isValidPassword((validPass)));
    }
    @Test
    void isValidPassword_InvalidPasswordNumber() {
        final String validPass = "Admbuild*qwert";
        assertFalse(authenticationService.isValidPassword((validPass)));
    }

    @Test
    void isValidEmail_ValidEmail() {
        final String validEmail = "amado@gmail.com";
        assertTrue(authenticationService.isValidEmail((validEmail)));
    }
    @Test
    void isValidEmail_InvalidEmailAddressSymbol() {
        final String validEmail = "amadotest.com";
        assertFalse(authenticationService.isValidEmail((validEmail)));
    }
    @Test
    void isValidEmail_InvalidEmailDotCom() {
        final String validEmail = "amado@testasdf";
        assertFalse(authenticationService.isValidEmail((validEmail)));
    }

    @Test
    void verifyUser_UserFound() {
        //Arrange
        final String mockVerificationCode = UUID.randomUUID().toString();
        User mockUser = User.builder()
                .verificationCode(mockVerificationCode)
                .build();

        //Mock
        Mockito.when(userRepository.findByVerificationCode(mockVerificationCode)).thenReturn(
                Optional.of(
                        mockUser
                )
        );
        Mockito.when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        //Action
        Optional<User> returnedUser = authenticationService.verifyUser(mockVerificationCode);

        //Assertions
        assertTrue(returnedUser.isPresent());
        assertTrue(returnedUser.get().isEnabled());
    }
    @Test
    void verifyUser_UserNotFound() {
        //Arrange
        final String mockVerificationCode = UUID.randomUUID().toString();
        User mockUser = User.builder()
                .build();

        //Mock
        Mockito.when(userRepository.findByVerificationCode(mockVerificationCode)).thenReturn(
                Optional.empty()
        );
        Mockito.when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        //Action
        Optional<User> returnedUser = authenticationService.verifyUser(mockVerificationCode);

        //Assertions
        assertTrue(returnedUser.isEmpty());
    }

    @Test
    void sendVerificationEmail_Success() throws Exception {
        // Arrange
        User user = new User();
        user.setEmail("user@example.com");
        user.setUserName("testuser");
        user.setVerificationCode("12345");
        String siteURL = "http://example.com";

        MimeMessage mimeMessage = new MimeMessage((Session) null);
        MimeMessage spyMessage = Mockito.spy(mimeMessage);
        Mockito.when(mailSender.createMimeMessage()).thenReturn(spyMessage);

        // Act
        authenticationService.sendVerificationEmail(user, siteURL);

        // Assert
        ArgumentCaptor<String> contentCaptor = ArgumentCaptor.forClass(String.class);
        Mockito.verify(spyMessage).setContent(contentCaptor.capture(), Mockito.eq("text/html"));
        String capturedContent = contentCaptor.getValue();
        assertTrue(capturedContent.contains(user.getUserName()));
        assertTrue(capturedContent.contains("http://example.com/api/perform_verify?code=" + user.getVerificationCode()));
    }
}