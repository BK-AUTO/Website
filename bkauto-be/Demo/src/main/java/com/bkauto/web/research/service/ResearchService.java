package com.bkauto.web.research.service;

import com.bkauto.web.research.entity.Research;
import com.bkauto.web.research.repository.ResearchRepository;
import com.bkauto.web.research.repository.ResearchSummaryProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResearchService {

    @Autowired
    private ResearchRepository researchRepository;

    public List<ResearchSummaryProjection> getAllResearch() {
        return researchRepository.findAllResearchSummary(Pageable.unpaged());
    }

    public List<ResearchSummaryProjection> getTopResearch() {
        return researchRepository.findAllResearchSummary(Pageable.ofSize(6));
    }

    public Optional<Research> getResearchById(Long id) {
        return researchRepository.findById(id).filter(research -> !research.isDeleted());
    }

    public Research saveResearch(Research research) {
        return researchRepository.save(research);
    }

    public Optional<Research> updateResearch(Long id, Research researchDetails) {
        return researchRepository.findById(id).map(research -> {
            if (research.isDeleted()) {
                return Optional.<Research>empty();
            }
            research.setTitle(researchDetails.getTitle());
            research.setContent(researchDetails.getContent());
            research.setThumbnail(researchDetails.getThumbnail());
            return Optional.of(researchRepository.save(research));
        }).orElse(Optional.empty());
    }

    public boolean deleteResearch(Long id) {
        return researchRepository.findById(id).map(research -> {
            research.setDeleted(true);
            researchRepository.save(research);
            return true;
        }).orElse(false);
    }
}
