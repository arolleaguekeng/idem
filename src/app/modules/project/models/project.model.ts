export interface ProjectModel {
    id?: string; // ID généré par Firestore
    name: string; // Nom du projet
    description: string; // Description du projet
    type: 'web' | 'mobile' | 'iot' | 'desktop'; // Type de projet
    constraints: {
      scalability: boolean; // Besoin de scalabilité
      security: boolean; // Besoin de sécurité
      budget: boolean; // Budget limité
    };
    createdAt: Date; // Date de création
    updatedAt: Date; // Date de mise à jour
    userId: string; // ID de l'utilisateur propriétaire
  }