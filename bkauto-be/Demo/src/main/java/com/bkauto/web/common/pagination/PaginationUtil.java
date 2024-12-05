package com.bkauto.web.common.pagination;

import com.bkauto.web.common.request.PaginationRequest;

public class PaginationUtil {

    public static PaginationInfo buildPaginationInfo(PaginationRequest request, int totalItems) {
        return PaginationInfo.builder()
                .page(request.getPage())
                .size(request.getSize())
                .total(totalItems)
                .build();
    }
}
