package com.bkauto.web.course.service;

import com.bkauto.web.course.entity.Course;
import com.bkauto.web.course.repository.CourseRepository;
import com.bkauto.web.course.repository.CourseSummaryProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<CourseSummaryProjection> getAllCourse() {
        return courseRepository.findAllCourseSummary(Pageable.unpaged());
    }

    public List<CourseSummaryProjection> getTopCourse() {
        return courseRepository.findAllCourseSummary(Pageable.ofSize(3));
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id).filter(course -> !course.isDeleted());
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public Optional<Course> updateCourse(Long id, Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            if (course.isDeleted()) {
                return Optional.<Course>empty();
            }
            course.setTitle(courseDetails.getTitle());
            course.setDifficulty(courseDetails.getDifficulty());
            course.setTopics(courseDetails.getTopics());
            course.setPrice(courseDetails.getPrice());
            course.setContent(courseDetails.getContent());
            course.setThumbnail(courseDetails.getThumbnail());
            return Optional.of(courseRepository.save(course));
        }).orElse(Optional.empty());
    }

    public boolean deleteCourse(Long id) {
        return courseRepository.findById(id).map(course -> {
            course.setDeleted(true);
            courseRepository.save(course);
            return true;
        }).orElse(false);
    }
}
