export interface Plante {
  id: number;
  nom: string;
  description?: string;
  propriete?: string;
  utilisation?: string;
  precaution?: string;
  regionGeographique?: string;
  categorie?: { id: number, nom: string }; // L'objet catégorie avec son nom
  imageBase64?: string; // Image en base64
}
