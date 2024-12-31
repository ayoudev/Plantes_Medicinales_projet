import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {
OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png';
  deco = 'assets/images/lavande.jpg';// Path to user avatar image
  showDropdown: boolean = false;

  plants: any[] = []; // Liste des plantes


  constructor(private router: Router) {}

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    // Logique de déconnexion (par exemple, effacer les informations de l'utilisateur)
    console.log('Déconnexion...');

    // Rediriger l'utilisateur vers la page de login ou une autre page
    this.router.navigate(['/login']);
  }
  stats = {
    plantes: 0,
    articles: 0,
    utilisateurs: 0,
    commentaires: 0,
  };


  ngOnInit(): void {
    // Simuler les données statistiques, ou appelez une API pour les récupérer
    this.fetchStats();
  }

  fetchStats() {
    // Exemple de données simulées
    this.stats = {
      plantes: 120,
      articles: 45,
      utilisateurs: 230,
      commentaires: 98,
    };
  }


}
