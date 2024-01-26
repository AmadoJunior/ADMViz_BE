package com.adm.cruddemo.controller;

import com.adm.cruddemo.DTO.Register;
import com.adm.cruddemo.entity.Role;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.service.AuthenticationService;
import com.adm.cruddemo.service.CaptchaService;
import com.adm.cruddemo.service.CustomUserDetails;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.models.media.MediaType;
import jakarta.mail.MessagingException;
import jakarta.persistence.Cacheable;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${app.domain.url}")
    private String domainURL;
    @Value("${app.domain.env}")
    private String ENV;
    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    CaptchaService captchaService;
    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Operation(
            description = "Gets user details for authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(
                            description = "Missing/Invalid Session",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
            }
    )
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
    @Operation(
            description = "Validates and creates new user.",
            responses = {
                    @ApiResponse(
                            description = "Created",
                            responseCode = "201",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Missing/Invalid Captcha Token",
                            responseCode = "503",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Duplicate User",
                            responseCode = "409",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Missing/Invalid Email Address",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Missing/Invalid Password",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
            }
    )
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

        authenticationService.sendVerificationEmail(savedUser, (ENV.equals("production") ? "https://" : "http://") + domainURL);

        logger.debug("User Successfully Created: " + savedUser.getId());
        return new ResponseEntity<>(HttpStatus.CREATED.getReasonPhrase(), HttpStatus.CREATED);
    }

    @Operation(
            description = "Verifies created user.",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "302",
                            content = @Content(
                                    mediaType = "text/html"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed Email Identification",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
            }
    )
    @Transactional
    @GetMapping("/perform_verify")
    public ResponseEntity<?> verifyUser(@RequestParam String code){
        Optional<User> verifiedUser = authenticationService.verifyUser(code);

        if(verifiedUser.isPresent()){
            logger.debug("User Successfully Identified: " + verifiedUser.get().getEmail());
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create((ENV.equals("production") ? "https://" : "http://") + domainURL)).build();
        }

        logger.debug("User Failed Email Identification: " + code);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
    }
}
