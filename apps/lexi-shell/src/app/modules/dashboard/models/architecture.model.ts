export interface ArchitectureModel {
  id?: string; // ID généré par Firestore
  projectId: string; // ID du projet associé
  type: 'basic' | 'recommended' | 'complex'; // Type d'architecture
  description: string; // Description de l'architecture
  technologies: {
    backend: string[]; // Technologies backend recommandées
    frontend: string[]; // Technologies frontend recommandées
    database: string[]; // Bases de données recommandées
    cloud: string[]; // Services cloud recommandés
  };
  createdAt: Date; // Date de création
}
