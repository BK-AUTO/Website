package com.bkauto.web.news.controller;

import com.bkauto.web.news.dto.NewsDto;
import com.bkauto.web.news.entity.News;
import com.bkauto.web.news.repository.NewsSummaryProjection;
import com.bkauto.web.news.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/manage/news")
public class NewsManagementController {

    @Autowired
    private NewsService newsService;

    @PostMapping
    public ResponseEntity<NewsDto> createNews(@RequestBody News news) {
        news.setPublishDate(Instant.now());
        News createdNews = newsService.saveNews(news);
        return ResponseEntity.ok(NewsDto.convertToNewsDTO(createdNews));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<NewsDto> uploadImage(
            @PathVariable Long id,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {
        try {
            News news = newsService.getNewsById(id).get();
            if (thumbnail != null && !thumbnail.isEmpty()) {
                news.setThumbnail(thumbnail.getBytes());
            }
            News createdNews = newsService.saveNews(news);
            return ResponseEntity.ok(NewsDto.convertToNewsDTO(createdNews));
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsDto> updateNews(@PathVariable Long id, @RequestBody News news) {
        Optional<News> updatedNews = newsService.updateNews(id, news);
        return updatedNews.map(updatedNewsItem -> ResponseEntity.ok(NewsDto.convertToNewsDTO(updatedNewsItem)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        boolean isDeleted = newsService.deleteNews(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
