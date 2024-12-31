import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard'; // Gardien d'authentification
import { PlantComponent } from './ui/plant/plant.component'; // Import du composant Plant
import { RegisterComponent } from './register/register.component';
import { ArticlComponent } from './ui/article/articl.component'; // Import du composant Article

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route vers login
  { path: 'register', component: RegisterComponent  }, // Route vers login
  { path: 'home', component: HomeComponent, canActivate: [authGuard] }, // Route sécurisée pour admin
  { path: 'plant', component: PlantComponent }, // Route pour Plant (User)
  { path: 'article', component: ArticlComponent }, // Route pour Article (User)
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirection par défaut
  { path: '**', redirectTo: '/login' } // Redirection pour les pages inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
