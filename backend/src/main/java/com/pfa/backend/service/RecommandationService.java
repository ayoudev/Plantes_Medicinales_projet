package com.pfa.backend.service;

import com.pfa.backend.entity.Plante;
import com.pfa.backend.repository.PlanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommandationService {

    private final PlanteRepository planteRepository;

    @Autowired
    public RecommandationService(PlanteRepository planteRepository) {
        this.planteRepository = planteRepository;
    }

    public List<Plante> getRecommandations(Long userId) {
        // Implémentation de la logique de recommandation en fonction de l'utilisateur
        // Par exemple, sélectionner des plantes selon les préférences ou l'historique de santé de l'utilisateur.
        // Ici, on peut faire une requête personnalisée en fonction des critères de l'utilisateur.

        // Exemple simplifié : retourner toutes les plantes (à personnaliser)
        return planteRepository.findAll();
    }
}
