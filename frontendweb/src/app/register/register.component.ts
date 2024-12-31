import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  standalone: true, // Déclarer le composant comme standalone
  imports: [CommonModule, FormsModule], // Ajout des modules nécessaires
  templateUrl: './register.component.html',
  styleUrls: ['../register/register.component.css'],
})
export class RegisterComponent {
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  onSignUp() {
    // Vérification si tous les champs sont remplis
    if (!this.firstname || !this.lastname || !this.email || !this.password) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return; // Arrête l'exécution si des champs sont vides
    }

    const user = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
    };

    this.registerService.register(user).subscribe(
      (response) => {
        console.log('Utilisateur enregistré avec succès:', response);
        this.router.navigate(['/login']); // Redirection après enregistrement
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
        this.errorMessage =
          error.status === 409
            ? 'Cet email est déjà utilisé.'
            : 'Une erreur est survenue. Veuillez réessayer.';
      }
    );
  }

}
