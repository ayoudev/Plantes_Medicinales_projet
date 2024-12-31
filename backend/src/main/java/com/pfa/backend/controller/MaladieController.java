package com.pfa.backend.controller;

import com.pfa.backend.dto.MaladieDTO;
import com.pfa.backend.service.MaladieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Permet d'éviter des problèmes CORS lors de l'appel depuis le frontend
@RestController
@RequestMapping("/api/maladies")
public class MaladieController {

    @Autowired
    private MaladieService maladieService;

    // Récupérer toutes les maladies
    @GetMapping
    public List<MaladieDTO> getAllMaladies() {
        return maladieService.getAllMaladies();
    }

    // Récupérer une maladie par ID
    @GetMapping("/{id}")
    public ResponseEntity<MaladieDTO> getMaladieById(@PathVariable Long id) {
        MaladieDTO maladieDTO = maladieService.getMaladieById(id);
        return maladieDTO != null ? ResponseEntity.ok(maladieDTO) : ResponseEntity.notFound().build();
    }

    // Créer une nouvelle maladie
    @PostMapping
    public ResponseEntity<MaladieDTO> createMaladie(@RequestBody MaladieDTO maladieDTO) {
        MaladieDTO savedMaladie = maladieService.createMaladie(maladieDTO);
        return ResponseEntity.ok(savedMaladie);
    }

    // Supprimer une maladie
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaladie(@PathVariable Long id) {
        maladieService.deleteMaladie(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaladieDTO> updateMaladie(@PathVariable Long id, @RequestBody MaladieDTO maladieDTO) {
        MaladieDTO updatedMaladie = maladieService.updateMaladie(id, maladieDTO);
        return updatedMaladie != null ? ResponseEntity.ok(updatedMaladie) : ResponseEntity.notFound().build();
    }
    @GetMapping("/count")
    public ResponseEntity<String> testService() {
        long count = maladieService.countMaladies();
        return ResponseEntity.ok(String.valueOf(count)); // Convert long to String
    }


}
