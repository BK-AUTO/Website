package com.bkauto.web.project.controller;

import com.bkauto.web.project.dto.ProjectDto;
import com.bkauto.web.project.entity.Project;
import com.bkauto.web.project.repository.ProjectSummaryProjection;
import com.bkauto.web.project.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<ProjectSummaryProjection> getAllProject() {
        return projectService.getAllProject();
    }

    @GetMapping("/top")
    public List<ProjectSummaryProjection> getTopProject() {
        return projectService.getTopProject();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        Optional<Project> news = projectService.getProjectById(id);
        return news.map(value -> ResponseEntity.ok(ProjectDto.convertToProjectDTO(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
