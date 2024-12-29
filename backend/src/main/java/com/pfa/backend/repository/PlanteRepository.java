package com.pfa.backend.repository;

import com.pfa.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PlanteRepository extends JpaRepository<Plante, Long> {
    @Query("SELECT p FROM Plante p JOIN p.maladies m WHERE m.nom = :maladie")
    List<Plante> findByMaladie(@Param("maladie") String maladie);
    List<Plante> findByNomContaining(String nom);
    List<Plante> findByProprieteContaining(String propriete);
    List<Plante> findByUtilisationContaining(String utilisation);
    List<Plante> findByRegionGeographiqueContaining(String regionGeographique);

    @Query("SELECT  p FROM Plante p WHERE " +
            "(:nom IS NULL OR p.nom LIKE %:nom%) AND " +
            "(:propriete IS NULL OR p.propriete LIKE %:propriete%) AND " +
            "(:utilisation IS NULL OR p.utilisation LIKE %:utilisation%) AND " +
            "(:region IS NULL OR p.regionGeographique LIKE %:region%)")
    List<Plante> searchPlantes(@Param("nom") String nom,
                               @Param("propriete") String propriete,
                               @Param("utilisation") String utilisation,
                               @Param("region") String region);
}
