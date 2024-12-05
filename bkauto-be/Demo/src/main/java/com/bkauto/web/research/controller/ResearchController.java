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
@RequestMapping("/api/researches")
public class ResearchController {

    @Autowired
    private ResearchService researchService;

    @GetMapping
    public List<ResearchSummaryProjection> getAllResearch() {
        return researchService.getAllResearch();
    }

    @GetMapping("/top")
    public List<ResearchSummaryProjection> getTopResearch() {
        return researchService.getTopResearch();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResearchDto> getResearchById(@PathVariable Long id) {
        Optional<Research> news = researchService.getResearchById(id);
        return news.map(value -> ResponseEntity.ok(ResearchDto.convertToResearchDTO(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
