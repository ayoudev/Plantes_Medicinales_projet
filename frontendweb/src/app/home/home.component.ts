import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeService } from './home.service';
import { Chart } from 'chart.js';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png';
  deco = 'assets/images/lavande.jpg';
  showDropdown: boolean = false;

  stats = {
    plantes: 0,
    articles: 0,
    maladies: 0,
  };

  totalStats = 1000; // Exemple de valeur totale pour normaliser les statistiques

  public chart: any;

  constructor(private router: Router, private homeService: HomeService) {}

  ngOnInit(): void {
    this.fetchStats(); // Récupérer les données
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }

  fetchStats(): void {
    this.homeService.getCountPlantes()
      .pipe(catchError(() => of('0')))
      .subscribe((plantesCount) => {
        this.stats.plantes = parseInt(plantesCount, 10);

        // Normaliser le nombre de plantes
        this.stats.plantes = (this.stats.plantes / this.totalStats) * 100;

        this.homeService.getCountMaladies()
          .pipe(catchError(() => of('0')))
          .subscribe((maladiesCount) => {
            this.stats.maladies = parseInt(maladiesCount, 10);

            // Normaliser le nombre de maladies
            this.stats.maladies = (this.stats.maladies / this.totalStats) * 100;

            this.homeService.getCountArticles()
              .pipe(catchError(() => of('0')))
              .subscribe((articlesCount) => {
                this.stats.articles = parseInt(articlesCount, 10);

                // Normaliser le nombre d'articles
                this.stats.articles = (this.stats.articles / this.totalStats) * 100;

                // Créez le graphique après avoir toutes les données
                this.createChart();
              });
          });
      });
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: ['Plantes', 'Maladies', 'Articles'],
        datasets: [
          {
            data: [
              this.stats.plantes,
              this.stats.maladies,
              this.stats.articles,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }
}
