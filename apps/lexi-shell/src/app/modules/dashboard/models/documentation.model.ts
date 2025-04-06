export interface Documentation {
    id?: string; // ID généré par Firestore
    projectId: string; // ID du projet associé
    content: string; // Contenu de la documentation (Markdown, HTML, etc.)
    diagrams: {
      useCase: string; // Diagramme de cas d'utilisation
      classDiagram: string; // Diagramme de classes
      sequenceDiagram: string; // Diagramme de séquence
    };
    createdAt: Date; // Date de création
  }