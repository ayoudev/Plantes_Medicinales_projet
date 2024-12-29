package com.pfa.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pfa.backend.dto.PlanteDTO;
import com.pfa.backend.entity.Categorie;
import com.pfa.backend.entity.Maladie;
import com.pfa.backend.entity.Plante;
import com.pfa.backend.repository.CategorieRepository;
import com.pfa.backend.repository.MaladieRepository;
import com.pfa.backend.service.CategorieService;
import com.pfa.backend.service.PlanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/plantes")
public class PlanteController {
    @Autowired
    private CategorieService categorieService;

    private final PlanteService planteService;

    @Autowired
    private MaladieRepository maladieRepository;
    @Autowired
    private CategorieRepository categorieRepository;


    @Autowired
    public PlanteController(PlanteService planteService) {
        this.planteService = planteService;
    }

    // Méthode pour ajouter une nouvelle plante
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPlante(
            @RequestParam(value = "nom", required = true) String nom,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "propriete", required = false) String propriete,
            @RequestParam(value = "utilisation", required = false) String utilisation,
            @RequestParam(value = "precaution", required = false) String precaution,
            @RequestParam(value = "regionGeographique", required = false) String regionGeographique,
            @RequestParam(value = "categorieNom", required = false) String categorieNom,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "maladieIds", required = false) List<Long> maladieIds
    ) {
        try {
            Plante plante = new Plante();
            plante.setNom(nom);
            plante.setDescription(description);
            plante.setPropriete(propriete);
            plante.setUtilisation(utilisation);
            plante.setPrecaution(precaution);
            plante.setRegionGeographique(regionGeographique);

            // Assign the category by name
            if (categorieNom != null && !categorieNom.isEmpty()) {
                Optional<Categorie> categorie = categorieService.findByNom(categorieNom);
                if (categorie.isPresent()) {
                    plante.setCategorie(categorie.get());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Catégorie introuvable avec le nom : " + categorieNom);
                }
            }

            // Assign the maladies by their IDs
            if (maladieIds != null && !maladieIds.isEmpty()) {
                List<Maladie> maladies = maladieIds.stream()
                        .map(id -> maladieRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Maladie introuvable avec l'ID : " + id)))
                        .toList();
                plante.setMaladies(maladies);
            }

            // Handle the image if provided
            if (image != null && !image.isEmpty()) {
                try {
                    plante.setImage(image.getBytes());
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erreur lors de la gestion de l'image");
                }
            }

            // Save the plante
            Plante savedPlante = planteService.createPlante(plante);
            return ResponseEntity.ok(savedPlante);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur interne du serveur");
        }
    }

    // Méthode pour obtenir toutes les plantes
    @GetMapping
    public List<PlanteDTO> getAllPlantes() {
        return planteService.getAllPlantes();
    }
    // Méthode pour rechercher des plantes
    @GetMapping("/search")
    public List<Plante> searchPlantes(@RequestParam(required = false) String nom,
                                      @RequestParam(required = false) String propriete,
                                      @RequestParam(required = false) String utilisation,
                                      @RequestParam(required = false) String region) {
        return planteService.searchPlantes(nom, propriete, utilisation, region);
    }

    // Méthode pour obtenir une plante par son ID
    @GetMapping("/{id}")
    public ResponseEntity<PlanteDTO> getPlanteById(@PathVariable Long id) {
        return planteService.getPlanteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Méthode pour mettre à jour une plante
    // Méthode pour mettre à jour une plante
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePlante(
            @PathVariable("id") Long id,
            @RequestParam(value = "nom", required = false) String nom,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "propriete", required = false) String propriete,
            @RequestParam(value = "utilisation", required = false) String utilisation,
            @RequestParam(value = "precaution", required = false) String precaution,
            @RequestParam(value = "regionGeographique", required = false) String regionGeographique,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "maladieIds", required = false) List<Long> maladieIds,
            @RequestParam(value = "categorieId", required = false) Long categorieId

    ) {
        try {
            System.out.println("Début de la mise à jour de la plante avec ID : " + id);
            Optional<Plante> planteOptional = planteService.findById(id);
            if (!planteOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plante introuvable avec l'ID : " + id);
            }

            Plante plante = planteOptional.get();
            plante.setNom(nom != null ? nom : plante.getNom());
            plante.setDescription(description != null ? description : plante.getDescription());
            plante.setPropriete(propriete != null ? propriete : plante.getPropriete());
            plante.setUtilisation(utilisation != null ? utilisation : plante.getUtilisation());
            plante.setPrecaution(precaution != null ? precaution : plante.getPrecaution());
            plante.setRegionGeographique(regionGeographique != null ? regionGeographique : plante.getRegionGeographique());

            // Gérer l'image si elle est fournie
            if (image != null && !image.isEmpty()) {
                try {
                    plante.setImage(image.getBytes());
                } catch (IOException e) {
                    System.out.println("Erreur lors de la gestion de l'image : " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la gestion de l'image");
                }
            }
            // Mettre à jour la catégorie si elle est fournie
            if (categorieId != null) {
                Categorie categorie = categorieRepository.findById(categorieId)
                        .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable avec l'ID : " + categorieId));
                plante.setCategorie(categorie);
            }


            // Mettre à jour les maladies
            if (maladieIds != null && !maladieIds.isEmpty()) {
                List<Maladie> maladies = maladieIds.stream()
                        .map(maladieId -> maladieRepository.findById(maladieId)
                                .orElseThrow(() -> new IllegalArgumentException("Maladie introuvable avec l'ID : " + maladieId)))
                        .collect(Collectors.toList());
                plante.setMaladies(maladies);
            }

            // Sauvegarder la plante mise à jour
            Plante updatedPlante = planteService.updatePlante(plante);
            System.out.println("Plante mise à jour : " + updatedPlante);
            return ResponseEntity.ok(updatedPlante);
        } catch (Exception e) {
            System.out.println("Erreur interne : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur");
        }
    }

    // Méthode pour supprimer une plante

    @CrossOrigin(origins = "http://localhost:4200") // Autoriser CORS pour cette route
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePlante(@PathVariable Long id) {
        try {
            planteService.deletePlante(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Méthode pour obtenir les plantes par maladie
    @GetMapping("/maladie")
    public List<Plante> getPlantesByMaladie(@RequestParam String maladie) {
        return planteService.getPlantesByMaladie(maladie);
    }
    @GetMapping("/count")
    public ResponseEntity<String> testService() {
        long count = planteService.countPlantes();
        return ResponseEntity.ok(String.valueOf(count));
    }

}
