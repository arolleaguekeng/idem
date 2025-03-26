export interface ProjectModel {
  id?: string; // ID généré par Firestore
  name: string; // Nom du projet
  description: string; // Description du projet
  type: 'web' | 'mobile' | 'iot' | 'desktop'; // Type de projet
  constraints: string[];
  teamSize: string;
  scope: string;
  budgetIntervals?: string;
  targets: string;
  createdAt: Date; // Date de création
  updatedAt: Date; // Date de mise à jour
  userId: string; // ID de l'utilisateur propriétaire
}
