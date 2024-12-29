export interface Comment {
  id?: number;
  contenu: string;
  auteur: string;
  createdAt?: Date;
  LocalDate?: string; // Ajoutez cette propriété
}
