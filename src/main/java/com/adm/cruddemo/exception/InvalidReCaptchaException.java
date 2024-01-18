package com.adm.cruddemo.exception;

public class InvalidReCaptchaException extends RuntimeException {
    public InvalidReCaptchaException(String responseContainsInvalidCharacters) {
        super(responseContainsInvalidCharacters);
    }
}
