package com.bkauto.web.common.exception;

import com.bkauto.web.common.response.BaseResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({ApplicationException.class})
    public ResponseEntity<?> businessException(ApplicationException e) {

        return ResponseEntity.status(e.getHttpStatus())
                .body(BaseResponse.buildErrorResponse(
                        Collections.singletonList(e.getErrorInfo())
                ));
    }


    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<?> exception(RuntimeException e) {
        logger.error("An error happened: {}", e.getMessage(), e);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(BaseResponse.buildErrorResponse(
                        Collections.singletonList(
                                new ErrorInfo(Error.INTERNAL_ERROR.getCode(), e.getMessage()))
                ));
    }

    @ExceptionHandler({BindException.class})
    public ResponseEntity<?> validationException(BindException ex) {
        List<ErrorInfo> errors = ex.getFieldErrors()
                .stream()
                .map(error -> new ErrorInfo(Error.VALIDATION_ERROR.getCode(),
                        String.format("%s %s", error.getField(), error.getDefaultMessage())))
                .collect(Collectors.toList());

        return ResponseEntity.badRequest().body(BaseResponse.buildErrorResponse(errors));
    }

}
