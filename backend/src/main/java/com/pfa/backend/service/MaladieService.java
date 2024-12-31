package com.pfa.backend.service;

import com.pfa.backend.dto.MaladieDTO;
import com.pfa.backend.entity.Maladie;
import com.pfa.backend.entity.Plante;
import com.pfa.backend.repository.MaladieRepository;
import com.pfa.backend.repository.PlanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaladieService {

    @Autowired
    private MaladieRepository maladieRepository;

    @Autowired
    private PlanteRepository planteRepository;  // Ajout du repository des plantes

    public long countMaladies() {
        return maladieRepository.count();
    }

    // Convertir une Maladie en MaladieDTO
    public MaladieDTO convertToDTO(Maladie maladie) {
        MaladieDTO maladieDTO = new MaladieDTO();
        maladieDTO.setId(maladie.getId());
        maladieDTO.setNom(maladie.getNom());
        maladieDTO.setCauses(maladie.getCauses());
        maladieDTO.setSymptomes(maladie.getSymptomes());
        maladieDTO.setInformations(maladie.getInformations());
        maladieDTO.setPlanteIds(maladie.getPlantes().stream().map(plante -> plante.getId()).collect(Collectors.toList()));
        return maladieDTO;
    }

    // Récupérer toutes les maladies
    public List<MaladieDTO> getAllMaladies() {
        List<Maladie> maladies = maladieRepository.findAll();
        return maladies.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Récupérer une maladie par ID
    public MaladieDTO getMaladieById(Long id) {
        return maladieRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    // Créer une nouvelle maladie
    public MaladieDTO createMaladie(MaladieDTO maladieDTO) {
        Maladie maladie = new Maladie();
        maladie.setNom(maladieDTO.getNom());
        maladie.setCauses(maladieDTO.getCauses());
        maladie.setSymptomes(maladieDTO.getSymptomes());
        maladie.setInformations(maladieDTO.getInformations());

        // Récupérer les plantes par leurs IDs et les associer à la maladie
        List<Plante> plantes = planteRepository.findAllById(maladieDTO.getPlanteIds());
        maladie.setPlantes(plantes);  // Associer les plantes à la maladie

        Maladie savedMaladie = maladieRepository.save(maladie);
        return convertToDTO(savedMaladie);
    }
    // Mettre à jour une maladie existante
    public MaladieDTO updateMaladie(Long id, MaladieDTO maladieDTO) {
        return maladieRepository.findById(id).map(existingMaladie -> {
            existingMaladie.setNom(maladieDTO.getNom());
            existingMaladie.setCauses(maladieDTO.getCauses());
            existingMaladie.setSymptomes(maladieDTO.getSymptomes());
            existingMaladie.setInformations(maladieDTO.getInformations());

            // Récupérer les plantes par leurs IDs et les associer à la maladie
            List<Plante> plantes = planteRepository.findAllById(maladieDTO.getPlanteIds());
            existingMaladie.setPlantes(plantes);

            Maladie updatedMaladie = maladieRepository.save(existingMaladie);
            return convertToDTO(updatedMaladie);
        }).orElse(null);
    }

    // Supprimer une maladie
    public void deleteMaladie(Long id) {
        maladieRepository.deleteById(id);
    }
}
