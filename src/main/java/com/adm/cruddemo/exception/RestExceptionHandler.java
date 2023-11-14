package com.adm.cruddemo.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler({
            UserNotFoundException.class,
    })
    public ResponseEntity<ErrorResponse> handleNotFoundException(UserNotFoundException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(404);
        error.setMessage(exception.getMessage());
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({
            DataIntegrityViolationException.class,
            MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ErrorResponse> handleDuplicateException(RuntimeException exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(400);
        error.setMessage("Bad Request");
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(Exception exception){
        ErrorResponse error = new ErrorResponse();
        error.setStatus(500);
        error.setMessage("Internal Server Error");
        error.setTimeStamp(System.currentTimeMillis());
        return new ResponseEntity<ErrorResponse>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
