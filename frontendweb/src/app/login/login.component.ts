import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../models/auth.models';
import { CommonModule } from '@angular/common'; // Importation de CommonModule
import { FormsModule } from '@angular/forms';  // Importation de FormsModule

@Component({
  selector: 'app-login',
  standalone: true, // Déclaration standalone
  imports: [CommonModule, FormsModule], // Ajout de CommonModule et FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  redirection():void{
    this.router.navigate(['/register']);
  }
  onLogin(): void {
    this.authService.authenticate(this.email, this.password).subscribe({
      next: (response: AuthResponse) => {
        this.authService.saveToken(response.token);
        if (response.role === 'ADMIN') {
          this.router.navigate(['/home']);
        } else if (response.role === 'USER') {
          this.router.navigate(['/user']);
        }
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
      },
    });
  }
}
