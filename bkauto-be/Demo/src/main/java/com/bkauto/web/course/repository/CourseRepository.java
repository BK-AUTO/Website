package com.bkauto.web.course.repository;

import com.bkauto.web.course.entity.Course;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT n.id as id, n.title as title, n.topics as topics, n.thumbnail as thumbnail " +
            "FROM Course n WHERE n.isDeleted = false ORDER BY id DESC")
    List<CourseSummaryProjection> findAllCourseSummary(Pageable pageable);

}
