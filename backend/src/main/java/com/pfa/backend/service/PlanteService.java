package com.pfa.backend.service;

import com.pfa.backend.dto.ArticleDTO;
import com.pfa.backend.dto.CommentaireDTO;
import com.pfa.backend.dto.PlanteDTO;
import com.pfa.backend.entity.*;
import com.pfa.backend.repository.CategorieRepository;
import com.pfa.backend.repository.MaladieRepository;
import com.pfa.backend.repository.PlanteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class PlanteService {

    private final PlanteRepository planteRepository;
    private final CategorieRepository categorieRepository;
    private final MaladieRepository maladieRepository;

    public long countPlantes() {
        return planteRepository.count();
    }

    @Autowired
    public PlanteService(PlanteRepository planteRepository, CategorieRepository categorieRepository, MaladieRepository maladieRepository) {
        this.planteRepository = planteRepository;
        this.categorieRepository = categorieRepository;
        this.maladieRepository = maladieRepository;
    }

    @Transactional
    public Plante createPlante(Plante plante) {
        if (plante.getMaladies() != null) {
            List<Maladie> maladies = plante.getMaladies().stream()
                    .map(m -> maladieRepository.findById(m.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Maladie introuvable avec l'ID : " + m.getId())))
                    .toList();
            plante.setMaladies(maladies);
        }

        if (plante.getCategorie() != null) {
            Categorie categorie = categorieRepository.findById(plante.getCategorie().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable"));
            plante.setCategorie(categorie);
        }

        return planteRepository.save(plante);
    }


    public Optional<Plante> findById(Long id) {
        return planteRepository.findById(id);
    }

    public Plante updatePlante(Plante plante) {
        return planteRepository.save(plante);
    }
    @Transactional
    public void deletePlante(Long id) {
        planteRepository.deleteById(id);
    }

    public List<PlanteDTO> getAllPlantes() {
        List<Plante> plantes = planteRepository.findAll();
        return plantes.stream().map(this::convertToDTO).toList();
    }


    public Optional<PlanteDTO> getPlanteById(Long id) {
        return planteRepository.findById(id).map(this::convertToDTO);
    }

    private PlanteDTO convertToDTO(Plante plante) {
        PlanteDTO dto = new PlanteDTO();
        dto.setId(plante.getId());
        dto.setNom(plante.getNom());
        dto.setDescription(plante.getDescription());
        dto.setPropriete(plante.getPropriete());
        dto.setUtilisation(plante.getUtilisation());
        dto.setPrecaution(plante.getPrecaution());
        dto.setRegionGeographique(plante.getRegionGeographique());
        dto.setCategorieId(plante.getCategorie() != null ? plante.getCategorie().getId() : null);
        dto.setMaladieIds(plante.getMaladies() != null ? plante.getMaladies().stream().map(Maladie::getId).toList() : null);
        dto.setImageBase64(plante.getImage() != null ? Base64.getEncoder().encodeToString(plante.getImage()) : null);
        return dto;
    }




public List<Plante> searchPlantes(String nom, String propriete, String utilisation, String region) {
        return planteRepository.searchPlantes(nom, propriete, utilisation, region);
    }

    public List<Plante> getPlantesByMaladie(String maladie) {
        return planteRepository.findByMaladie(maladie);
    }
}
