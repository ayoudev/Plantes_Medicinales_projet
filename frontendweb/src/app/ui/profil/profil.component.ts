import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './profil.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common'; // Importation du CommonModule

@Component({
  selector: 'app-profil',
  standalone: true,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [CommonModule], // Ajout du CommonModule ici
})
export class ProfilComponent implements OnInit {
  OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png';
  deco = 'assets/images/lavande.jpg';
  showDropdown = false;
  userData: any = {};

  constructor(private router: Router, private userService: UserService) {}

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token'); // Assurez-vous que le token est stocké après la connexion

    if (token) {
      this.userService.getAuthenticatedUser(token).subscribe({
        next: (data) => {
          this.userData = {
            ...data,
            imageUrl: this.avatar, // Utilisez une image par défaut si non disponible
          };
        },
        error: (err) => {
          Swal.fire('Erreur', 'Impossible de récupérer les données utilisateur', 'error');
          console.error(err);
        },
      });
    } else {
      Swal.fire('Erreur', 'Utilisateur non connecté', 'error');
      this.router.navigate(['/login']);
    }
  }
}
