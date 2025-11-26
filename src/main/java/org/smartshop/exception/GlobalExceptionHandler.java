package org.smartshop.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String,Object>> handleUnauthorizedException(UnauthorizedException ex, HttpServletRequest request) {

        return details(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleRessourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        return details(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String,Object>> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        return details(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request);
    }

    private  ResponseEntity<Map<String,Object>> details(HttpStatus status, String message, HttpServletRequest request) {
        Map<String,Object> response = Map.of(
                "timestamp", LocalDateTime.now(),
                "status", status.value(),
                "error type", status.getReasonPhrase(),
                "message", message,
                "path", request.getRequestURI()
        );

        return new ResponseEntity<>(response, status);
    }

}
