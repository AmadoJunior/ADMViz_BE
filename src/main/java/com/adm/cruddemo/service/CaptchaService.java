package com.adm.cruddemo.service;

import com.adm.cruddemo.DTO.GoogleResponse;
import com.adm.cruddemo.captcha.CaptchaSettings;
import com.adm.cruddemo.controller.AuthenticationController;
import com.adm.cruddemo.exception.InvalidReCaptchaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestOperations;

import java.net.URI;
import java.util.regex.Pattern;
@Service
public class CaptchaService {
    @Autowired
    private CaptchaSettings captchaSettings;
    @Autowired
    private RestOperations restTemplate;
    private Logger logger = LoggerFactory.getLogger(CaptchaService.class);

    public void processToken(String captchaToken) throws InvalidReCaptchaException {
        if(!responseSanityCheck(captchaToken)) {
            throw new InvalidReCaptchaException("Response contains invalid characters");
        }

        URI verifyUri = URI.create(String.format(
                "https://www.google.com/recaptcha/api/siteverify?secret=%s&response=%s",
                captchaSettings.getSecret(), captchaToken));

        GoogleResponse googleResponse = restTemplate.getForObject(verifyUri, GoogleResponse.class);
        logger.debug(googleResponse.toString());

        if(!googleResponse.isSuccess()) {
            throw new InvalidReCaptchaException("reCaptcha was not successfully validated");
        }
    }

    private boolean responseSanityCheck(String response) {
        return StringUtils.hasLength(response);
    }
}
