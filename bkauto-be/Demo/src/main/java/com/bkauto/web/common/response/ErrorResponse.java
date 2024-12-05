package com.bkauto.web.common.response;

import com.bkauto.web.common.exception.ErrorInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ErrorResponse<T> extends GenericResponse<T> {

    private List<ErrorInfo> errors;
}
