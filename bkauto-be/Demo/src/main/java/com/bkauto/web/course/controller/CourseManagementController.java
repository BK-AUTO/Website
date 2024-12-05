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
@RequestMapping("/api/manage/courses")
public class CourseManagementController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseDto> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.saveCourse(course);
        return ResponseEntity.ok(CourseDto.convertToCourseDTO(createdCourse));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CourseDto> uploadImage(
            @PathVariable Long id,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {
        try {
            Course course = courseService.getCourseById(id).get();
            if (thumbnail != null && !thumbnail.isEmpty()) {
                course.setThumbnail(thumbnail.getBytes());
            }
            Course createdCourse = courseService.saveCourse(course);
            return ResponseEntity.ok(CourseDto.convertToCourseDTO(createdCourse));
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Optional<Course> updatedCourse = courseService.updateCourse(id, course);
        return updatedCourse.map(updatedCourseItem -> ResponseEntity.ok(CourseDto.convertToCourseDTO(updatedCourseItem)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        boolean isDeleted = courseService.deleteCourse(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
