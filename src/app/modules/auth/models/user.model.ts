export interface UserModel {
    uid: string; // ID Firebase Auth
    email: string; // Email de l'utilisateur
    displayName?: string; // Nom affiché
    photoURL?: string; // URL de la photo de profil
    subscription: 'free' | 'pro' | 'enterprise'; // Type d'abonnement
    createdAt: Date; // Date de création du compte
    lastLogin: Date; // Date de dernière connexion
  }