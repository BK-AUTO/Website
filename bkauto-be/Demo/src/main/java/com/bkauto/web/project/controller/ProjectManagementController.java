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
@RequestMapping("/api/manage/projects")
public class ProjectManagementController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody Project project) {
        project.setPublishDate(Instant.now());
        Project createdProject = projectService.saveProject(project);
        return ResponseEntity.ok(ProjectDto.convertToProjectDTO(createdProject));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProjectDto> uploadImage(
            @PathVariable Long id,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {
        try {
            Project project = projectService.getProjectById(id).get();
            if (thumbnail != null && !thumbnail.isEmpty()) {
                project.setThumbnail(thumbnail.getBytes());
            }
            Project createdProject = projectService.saveProject(project);
            return ResponseEntity.ok(ProjectDto.convertToProjectDTO(createdProject));
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @RequestBody Project project) {
        Optional<Project> updatedProject = projectService.updateProject(id, project);
        return updatedProject.map(updatedProjectItem -> ResponseEntity.ok(ProjectDto.convertToProjectDTO(updatedProjectItem)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        boolean isDeleted = projectService.deleteProject(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
