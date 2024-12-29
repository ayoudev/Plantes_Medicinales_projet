import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component'; // Import HomeComponent
import { PlanteComponent } from './plante/plante.component';
import { MaladieComponent } from './maladie/maladie.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { UserHomeComponent } from './ui/user-home/user-home.component';
import { PlantComponent } from './ui/plant/plant.component'; // Import du composant Plant
import { ProfilComponent } from './ui/profil/profil.component'; // Import du composant Article
import { RegisterComponent } from './register/register.component'; // Import du composant Article

import { ArticlComponent } from './ui/article/articl.component'; // Import du composant Article

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent } ,
  { path: 'plante', component: PlanteComponent } ,
  { path: 'maladie', component: MaladieComponent } ,
  { path: 'utilisateur', component: UtilisateurComponent } ,
  { path: 'article', component: ArticleComponent } ,
  { path: 'user', component: UserHomeComponent },
  { path: 'register', component: RegisterComponent },


  // for user
  { path: 'aricl', component: ArticlComponent }, // Route pour Plant (User)
  { path: 'plant', component: PlantComponent }, // Route pour Plant (User)
  { path: 'profil', component: ProfilComponent }, // Route pour Article (User)
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
