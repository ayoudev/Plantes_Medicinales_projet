export interface Plante {
  id: number;
  nom: string;
}

export interface Article {
  id: number;
  titre: string;
  contenu: string;
  image?: string; // L'image est maintenant optionnelle dans l'interface
  plante: Plante;
}

