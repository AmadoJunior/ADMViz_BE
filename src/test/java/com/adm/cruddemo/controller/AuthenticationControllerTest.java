package com.adm.cruddemo.controller;

import com.adm.cruddemo.DTO.Register;
import com.adm.cruddemo.captcha.CaptchaSettings;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.service.AuthenticationService;
import com.adm.cruddemo.service.CaptchaService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@WebMvcTest(controllers = AuthenticationController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class AuthenticationControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private AuthenticationService authenticationService;
    @MockBean
    private CaptchaSettings captchaSettings;
    @MockBean
    private CaptchaService captchaService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
        Mockito.reset(authenticationService);
    }

    @Test
    public void PerformRegister() throws RuntimeException {
        Register registerDTO = new Register("Amado", "Dominguez", "amadojuniorasd", "amadoelrepalol@gmail.com", "Admbuilt*123", "token");

        when(authenticationService.isDuplicateUser(registerDTO.getUserName(), registerDTO.getEmail())).thenReturn(false);
        when(authenticationService.isValidEmail(registerDTO.getEmail())).thenReturn(true);
        when(authenticationService.isValidPassword(registerDTO.getPassword())).thenReturn(true);
        when(authenticationService.isValidPassword(registerDTO.getPassword())).thenReturn(true);
        Mockito.when(authenticationService.createUser(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        try {
            ResultActions response = mockMvc.perform(post("/api/perform_register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf8")
                    .content(objectMapper.writeValueAsString(registerDTO)));
            response.andExpect(MockMvcResultMatchers.status().isCreated());
        } catch (JsonProcessingException e) {
            // Handle the exception appropriately
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
