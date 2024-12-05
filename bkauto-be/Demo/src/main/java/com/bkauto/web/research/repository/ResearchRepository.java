package com.bkauto.web.research.repository;

import com.bkauto.web.research.entity.Research;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchRepository extends JpaRepository<Research, Long> {

    @Query("SELECT n.id as id, n.title as title, n.publishDate as publishDate, n.thumbnail as thumbnail " +
            "FROM Research n WHERE n.isDeleted = false ORDER BY publishDate DESC")
    List<ResearchSummaryProjection> findAllResearchSummary(Pageable pageable);

}
