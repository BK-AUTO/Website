package com.bkauto.web.news.service;

import com.bkauto.web.news.entity.News;
import com.bkauto.web.news.repository.NewsRepository;
import com.bkauto.web.news.repository.NewsSummaryProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    public List<NewsSummaryProjection> getAllNews() {
        return newsRepository.findAllNewsSummary(Pageable.unpaged());
    }

    public List<NewsSummaryProjection> getTopNews() {
        return newsRepository.findAllNewsSummary(Pageable.ofSize(5));
    }

    public Optional<News> getNewsById(Long id) {
        return newsRepository.findById(id).filter(news -> !news.isDeleted());
    }

    public News saveNews(News news) {
        if (news.getTopic() != null && news.getTopic().isBlank()) {
            news.setTopic("Chưa phân loại");
        }
        return newsRepository.save(news);
    }

    public Optional<News> updateNews(Long id, News newsDetails) {
        return newsRepository.findById(id).map(news -> {
            if (news.isDeleted()) {
                return Optional.<News>empty();
            }
            news.setTitle(newsDetails.getTitle());
            news.setSummary(newsDetails.getSummary());
            news.setContent(newsDetails.getContent());
            news.setTopic(newsDetails.getTopic());
            news.setThumbnail(newsDetails.getThumbnail());
            return Optional.of(newsRepository.save(news));
        }).orElse(Optional.empty());
    }

    public boolean deleteNews(Long id) {
        return newsRepository.findById(id).map(news -> {
            news.setDeleted(true);
            newsRepository.save(news);
            return true;
        }).orElse(false);
    }
}
