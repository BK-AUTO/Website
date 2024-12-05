package com.bkauto.web.project.dto;

import com.bkauto.web.project.entity.Project;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {

    private Long id;
    private String title;
    private String content;
    private Instant publishDate;
    private byte[] thumbnail;

    public static ProjectDto convertToProjectDTO(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .content(project.getContent())
                .publishDate(project.getPublishDate())
                .thumbnail(project.getThumbnail())
                .build();
    }
}
