package com.bkauto.web.common.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
public class PaginationRequest {

    private int page = 1;
    private int size = 10;
    private int offset = 0;
    private String sort;

}