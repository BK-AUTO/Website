package com.bkauto.web.project.service;

import com.bkauto.web.project.entity.Project;
import com.bkauto.web.project.repository.ProjectRepository;
import com.bkauto.web.project.repository.ProjectSummaryProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectSummaryProjection> getAllProject() {
        return projectRepository.findAllProjectSummary(Pageable.unpaged());
    }

    public List<ProjectSummaryProjection> getTopProject() {
        return projectRepository.findAllProjectSummary(Pageable.ofSize(6));
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id).filter(project -> !project.isDeleted());
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public Optional<Project> updateProject(Long id, Project projectDetails) {
        return projectRepository.findById(id).map(project -> {
            if (project.isDeleted()) {
                return Optional.<Project>empty();
            }
            project.setTitle(projectDetails.getTitle());
            project.setContent(projectDetails.getContent());
            project.setThumbnail(projectDetails.getThumbnail());
            return Optional.of(projectRepository.save(project));
        }).orElse(Optional.empty());
    }

    public boolean deleteProject(Long id) {
        return projectRepository.findById(id).map(project -> {
            project.setDeleted(true);
            projectRepository.save(project);
            return true;
        }).orElse(false);
    }
}
