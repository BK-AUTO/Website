package com.bkauto.web.research.dto;

import com.bkauto.web.research.entity.Research;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchDto {

    private Long id;
    private String title;
    private String content;
    private Instant publishDate;
    private byte[] thumbnail;

    public static ResearchDto convertToResearchDTO(Research research) {
        return ResearchDto.builder()
                .id(research.getId())
                .title(research.getTitle())
                .content(research.getContent())
                .publishDate(research.getPublishDate())
                .thumbnail(research.getThumbnail())
                .build();
    }
}
