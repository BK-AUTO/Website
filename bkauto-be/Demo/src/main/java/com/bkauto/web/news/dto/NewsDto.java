package com.bkauto.web.news.dto;

import com.bkauto.web.news.entity.News;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsDto {

    private Long id;
    private String title;
    private String content;
    private String summary;
    private Instant publishDate;
    private String topic;
    private byte[] thumbnail;

    public static NewsDto convertToNewsDTO(News news) {
        return NewsDto.builder()
                .id(news.getId())
                .title(news.getTitle())
                .content(news.getContent())
                .summary(news.getSummary())
                .publishDate(news.getPublishDate())
                .topic(news.getTopic())
                .thumbnail(news.getThumbnail())
                .build();
    }
}
