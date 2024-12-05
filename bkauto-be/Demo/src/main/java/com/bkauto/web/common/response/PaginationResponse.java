package com.bkauto.web.common.response;

import com.bkauto.web.common.pagination.PaginationInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PaginationResponse {

    private PaginationInfo paginationInfo;
}
