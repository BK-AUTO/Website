package com.bkauto.web.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class ErrorInfo {

    private String code;
    private String message;
}
