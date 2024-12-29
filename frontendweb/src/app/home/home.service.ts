import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiArticle = 'http://localhost:8082/api/articles/count';
  private apiPlantes = 'http://localhost:8082/api/plantes/count';
  private apiMaladies = 'http://localhost:8082/api/maladies/count';

  constructor(private http: HttpClient) {}

  getCountArticles(): Observable<string> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<string>(this.apiArticle, { headers });
  }

  getCountPlantes(): Observable<string> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<string>(this.apiPlantes, { headers });
  }

  getCountMaladies(): Observable<string> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<string>(this.apiMaladies, { headers });
  }

}
