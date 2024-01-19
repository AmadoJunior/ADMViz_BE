package com.adm.cruddemo.service;

import com.adm.cruddemo.controller.AuthenticationController;
import com.adm.cruddemo.entity.Role;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.repository.RoleRepo;
import com.adm.cruddemo.repository.UserRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Optional;
import java.util.regex.Pattern;

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
    @Autowired
    private JavaMailSender mailSender;
    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    public boolean isDuplicateUser(String userName, String email) {
        return userRepository.findByUserName(userName).isPresent() || userRepository.findByUserEmail(email).isPresent();
    }

    public boolean isValidPassword(String password) {
        return Pattern.compile("^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$")
                .matcher(password)
                .matches();
    }

    public boolean isValidEmail(String email) {
        return Pattern.compile("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
                .matcher(email)
                .matches();
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

    public Optional<User> verifyUser(String verificationCode) {
        Optional<User> foundUser = userRepository.findByVerificationCode(verificationCode);

        if(foundUser.isEmpty()){
            return foundUser;
        }

        foundUser.get().setEnabled(true);
        foundUser.get().setVerificationCode(null);
        User savedUser = userRepository.save(foundUser.get());
        return Optional.ofNullable(savedUser);
    }

    public void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "admportfoliobot@gmail.com";
        String senderName = "ADMViz";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_blank\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "ADMViz";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getUserName());
        String verifyURL = siteURL + "/api/perform_verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }
}
