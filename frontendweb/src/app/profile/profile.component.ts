import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png'; 
  deco = 'assets/images/lavande.jpg';// Path to user avatar image
  showDropdown: boolean = false;
  constructor(private router: Router) {}
  userData = {
    username: 'user123',
    nom: 'Doe',
    prenom: 'John',
    service: 'IT',
    tel: '0612345678',
    email: 'john.doe@example.com',
    adress: '123 Rue Exemple',
    cin: 'A123456',
    position: 'Developer',
    date_naissance: '1990-01-01',
    genre: 'homme',
    imageUrl: ''
  };
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Logout method
  logout(): void {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }


  ngOnInit(): void {}

  handleChangePassword(): void {
    Swal.fire({
      title: 'Changer le mot de passe',
      html: `
        <input type="password" id="currentPassword" class="swal2-input" placeholder="Mot de passe actuel">
        <input type="password" id="newPassword" class="swal2-input" placeholder="Nouveau mot de passe">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmer le mot de passe">
      `,
      showCancelButton: true,
      confirmButtonText: 'Changer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const currentPassword = (Swal.getPopup()!.querySelector('#currentPassword') as HTMLInputElement).value;
        const newPassword = (Swal.getPopup()!.querySelector('#newPassword') as HTMLInputElement).value;
        const confirmPassword = (Swal.getPopup()!.querySelector('#confirmPassword') as HTMLInputElement).value;

        if (!currentPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
        } else if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Les mots de passe ne correspondent pas');
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Succès', 'Mot de passe changé avec succès', 'success');
      }
    });
  }

  handleProfileImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userData.imageUrl = URL.createObjectURL(file);
      Swal.fire('Succès', 'Image de profil mise à jour avec succès', 'success');
    }
  }

  handleSubmit(): void {
    Swal.fire('Succès', 'Profile sauvegardé avec succès', 'success');
    console.log(this.userData);
  }
}
