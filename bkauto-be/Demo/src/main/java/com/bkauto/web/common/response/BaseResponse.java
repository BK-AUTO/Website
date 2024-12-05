package com.bkauto.web.common.response;

import com.bkauto.web.common.exception.ErrorInfo;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@NoArgsConstructor
@SuperBuilder
public class BaseResponse {

    public static <T> GenericResponse<T> buildSuccessResponse(T data) {
        return GenericResponse.<T>builder()
                .status(Status.SUCCESS)
                .data(data)
                .build();
    }

    public static ErrorResponse<?> buildErrorResponse(List<ErrorInfo> errors) {

        return ErrorResponse.builder()
                .status(Status.ERROR)
                .errors(errors)
                .build();
    }
}
