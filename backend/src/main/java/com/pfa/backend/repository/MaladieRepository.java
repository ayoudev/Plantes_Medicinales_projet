package com.pfa.backend.repository;

import com.pfa.backend.entity.Maladie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaladieRepository extends JpaRepository<Maladie, Long> {

}