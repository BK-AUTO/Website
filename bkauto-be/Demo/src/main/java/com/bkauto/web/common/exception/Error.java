package com.bkauto.web.common.exception;

public enum Error {
    INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Error while validating"),
    RATE_LIMIT_EXCEED("RATE_LIMIT_EXCEED", "Too many requests");

    private final String code;
    private final String defaultMessage;

    Error(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return defaultMessage;
    }
}
