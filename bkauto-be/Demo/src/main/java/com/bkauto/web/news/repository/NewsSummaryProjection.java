package com.bkauto.web.news.repository;

import java.time.Instant;

public interface NewsSummaryProjection {
    Long getId();
    String getTitle();
    String getSummary();
    Instant getPublishDate();
    String getTopic();
    byte[] getThumbnail();
}

