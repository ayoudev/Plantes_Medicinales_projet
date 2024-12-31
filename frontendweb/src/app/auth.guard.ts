import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Vérifiez la présence du token dans localStorage
  const token = localStorage.getItem('auth_token');

  if (token) {
    // Autorise l'accès si le token existe
    return true;
  } else {
    // Bloque l'accès et redirige vers /login
    router.navigate(['/login']);
    return false;
  }
};
