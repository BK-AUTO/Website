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
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public List<NewsSummaryProjection> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/top")
    public List<NewsSummaryProjection> getTopNews() {
        return newsService.getTopNews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsDto> getNewsById(@PathVariable Long id) {
        Optional<News> news = newsService.getNewsById(id);
        return news.map(value -> ResponseEntity.ok(NewsDto.convertToNewsDTO(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
