package com.bkauto.web.research.controller;

import com.bkauto.web.research.dto.ResearchDto;
import com.bkauto.web.research.entity.Research;
import com.bkauto.web.research.repository.ResearchSummaryProjection;
import com.bkauto.web.research.service.ResearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/manage/researches")
public class ResearchManagementController {

    @Autowired
    private ResearchService researchService;

    @PostMapping
    public ResponseEntity<ResearchDto> createResearch(@RequestBody Research research) {
        research.setPublishDate(Instant.now());
        Research createdResearch = researchService.saveResearch(research);
        return ResponseEntity.ok(ResearchDto.convertToResearchDTO(createdResearch));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResearchDto> uploadImage(
            @PathVariable Long id,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail) {
        try {
            Research research = researchService.getResearchById(id).get();
            if (thumbnail != null && !thumbnail.isEmpty()) {
                research.setThumbnail(thumbnail.getBytes());
            }
            Research createdResearch = researchService.saveResearch(research);
            return ResponseEntity.ok(ResearchDto.convertToResearchDTO(createdResearch));
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResearchDto> updateResearch(@PathVariable Long id, @RequestBody Research research) {
        Optional<Research> updatedResearch = researchService.updateResearch(id, research);
        return updatedResearch.map(updatedResearchItem -> ResponseEntity.ok(ResearchDto.convertToResearchDTO(updatedResearchItem)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResearch(@PathVariable Long id) {
        boolean isDeleted = researchService.deleteResearch(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
