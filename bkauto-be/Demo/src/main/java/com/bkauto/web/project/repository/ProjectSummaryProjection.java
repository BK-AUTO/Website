package com.bkauto.web.project.repository;

import java.time.Instant;

public interface ProjectSummaryProjection {
    Long getId();

    String getTitle();

    Instant getPublishDate();

    byte[] getThumbnail();
}

