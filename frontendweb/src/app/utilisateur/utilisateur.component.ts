import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UtilisateurService } from './utilisateur.service'; // Import du service
import { Utilisateur } from './utilisateur.model'; // Import du modèle

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css'],
})
export class UtilisateurComponent implements OnInit {
  OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png';
  deco = 'assets/images/lavande.jpg';
  showDropdown: boolean = false;

  utilisateurs: Utilisateur[] = [];
  showDeleteConfirmModal: boolean = false;
  selectedUtilisateur: Utilisateur | null = null;

  constructor(private router: Router, private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.fetchUtilisateurs();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }

  fetchUtilisateurs(): void {
    this.utilisateurService.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        Swal.fire('Erreur', 'Impossible de charger les utilisateurs.', 'error');
      }
    );
  }

  showDeleteModal(utilisateur: Utilisateur): void {
    this.selectedUtilisateur = utilisateur;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmModal = false;
    this.selectedUtilisateur = null;
  }

  deleteUtilisateur(): void {
    if (this.selectedUtilisateur) {
      this.utilisateurService.deleteUserById(this.selectedUtilisateur.id).subscribe(
        () => {
          Swal.fire('Succès', 'Utilisateur supprimé avec succès.', 'success');
          this.fetchUtilisateurs(); // Rafraîchissement de la liste
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
          Swal.fire('Erreur', 'Échec de la suppression.', 'error');
        }
      );
    }
  }
}
