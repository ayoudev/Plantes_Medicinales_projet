package com.pfa.backend.controller;

import com.pfa.backend.entity.Plante;
import com.pfa.backend.service.RecommandationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/recommandations")
public class RecommandationController {

    private final RecommandationService recommandationService;

    @Autowired
    public RecommandationController(RecommandationService recommandationService) {
        this.recommandationService = recommandationService;
    }

    @GetMapping("/{userId}")
    public List<Plante> getRecommandations(@PathVariable Long userId) {
        return recommandationService.getRecommandations(userId);
    }
}
