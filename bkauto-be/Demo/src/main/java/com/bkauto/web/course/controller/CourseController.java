package com.bkauto.web.course.controller;

import com.bkauto.web.course.dto.CourseDto;
import com.bkauto.web.course.entity.Course;
import com.bkauto.web.course.repository.CourseSummaryProjection;
import com.bkauto.web.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<CourseSummaryProjection> getAllCourse() {
        return courseService.getAllCourse();
    }

    @GetMapping("/top")
    public List<CourseSummaryProjection> getTopCourse() {
        return courseService.getTopCourse();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(value -> ResponseEntity.ok(CourseDto.convertToCourseDTO(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
