package com.adm.cruddemo.exception;

public class TooManyResourcesException extends RuntimeException {
    public TooManyResourcesException(String message) {
        super(message);
    }
}
