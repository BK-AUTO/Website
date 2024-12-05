package com.bkauto.web.research.repository;

import java.time.Instant;

public interface ResearchSummaryProjection {
    Long getId();

    String getTitle();

    Instant getPublishDate();

    byte[] getThumbnail();
}

