export interface Maladie {
  id: number;
  nom: string;
  planteIds?: number[];
  informations: string;
  symptomes: string;
  causes: string;
}

