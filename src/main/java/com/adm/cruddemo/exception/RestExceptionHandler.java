package com.adm.cruddemo.exception;

import jakarta.mail.MessagingException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.naming.AuthenticationException;
import java.io.UnsupportedEncodingException;
import java.nio.file.AccessDeniedException;

@ControllerAdvice
public class RestExceptionHandler {
    //ResourceNotFoundException
    @ExceptionHandler({
            ResourceNotFoundException.class,
            com.adm.cruddemo.exception.ResourceNotFoundException.class
    })
    public ResponseEntity<ErrorResponse> handleNotFoundException(RuntimeException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setMessage(HttpStatus.NOT_FOUND.getReasonPhrase());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler({
            DataIntegrityViolationException.class,
            MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequestException(RuntimeException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setMessage(HttpStatus.BAD_REQUEST.getReasonPhrase());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler({
            AuthenticationException.class,
            AccessDeniedException.class,
            com.adm.cruddemo.exception.AccessDeniedException.class
    })
    public ResponseEntity<ErrorResponse> handleAuthenticationException(Exception exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(HttpStatus.UNAUTHORIZED.value());
        error.setMessage(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler({
            DuplicateUsernameException.class
    })
    public ResponseEntity<ErrorResponse> handleDuplicateUsername(RuntimeException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(HttpStatus.CONFLICT.value());
        error.setMessage(HttpStatus.CONFLICT.getReasonPhrase());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.CONFLICT);
    }
    @ExceptionHandler({
            MessagingException.class,
            UnsupportedEncodingException.class
    })
    public ResponseEntity<ErrorResponse> handleGenericException(RuntimeException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.setMessage(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
