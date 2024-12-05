package com.bkauto.web.course.dto;

import com.bkauto.web.course.entity.Course;
import lombok.*;

import java.util.ArrayList;
import java.util.Arrays;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDto {

    private Long id;
    private String title;
    private int difficulty;
    private Long price;
    private String content;
    private String topics;
    private byte[] thumbnail;

    public static CourseDto convertToCourseDTO(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .difficulty(course.getDifficulty())
                .price(course.getPrice())
                .content(course.getContent())
                .topics(course.getTopics())
                .thumbnail(course.getThumbnail())
                .build();
    }

}
