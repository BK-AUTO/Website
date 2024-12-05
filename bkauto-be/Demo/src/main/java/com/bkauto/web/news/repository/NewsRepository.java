package com.bkauto.web.news.repository;

import com.bkauto.web.news.entity.News;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n.id as id, n.title as title, n.summary as summary, n.publishDate as publishDate, n.topic as topic, n.thumbnail as thumbnail " +
            "FROM News n WHERE n.isDeleted = false ORDER BY publishDate DESC")
    List<NewsSummaryProjection> findAllNewsSummary(Pageable pageable);

}
