export interface ScriptModel {
    id?: string; // ID généré par Firestore
    architectureId: string; // ID de l'architecture associée
    os: 'windows' | 'macos' | 'linux'; // Système d'exploitation cible
    content: string; // Contenu du script (Bash, PowerShell, etc.)
    createdAt: Date; // Date de création
  }