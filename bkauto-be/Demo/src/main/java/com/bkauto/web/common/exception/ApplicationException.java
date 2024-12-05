package com.bkauto.web.common.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ApplicationException extends RuntimeException {

    private ErrorInfo errorInfo;
    private HttpStatus httpStatus;

    public ApplicationException(Error error, String overrideMessage, HttpStatus httpStatus) {
        this.errorInfo = new ErrorInfo(error.getCode(), overrideMessage);
        this.httpStatus = httpStatus;
    }

    public ApplicationException(Error error, HttpStatus httpStatus) {
        this.errorInfo = new ErrorInfo(error.getCode(), error.getMessage());
        this.httpStatus = httpStatus;
    }

}

