package com.bkauto.web.project.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<com.bkauto.web.project.entity.Project, Long> {

    @Query("SELECT n.id as id, n.title as title, n.publishDate as publishDate, n.thumbnail as thumbnail " +
            "FROM Project n WHERE n.isDeleted = false ORDER BY publishDate DESC")
    List<com.bkauto.web.project.repository.ProjectSummaryProjection> findAllProjectSummary(Pageable pageable);

}
