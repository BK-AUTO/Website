package com.bkauto.web.course.repository;

public interface CourseSummaryProjection {
    Long getId();

    String getTitle();

    String getTopic();

    byte[] getThumbnail();
}

