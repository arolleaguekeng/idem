import { Injectable, OnInit, inject } from '@angular/core';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/services/auth.service';
import { ProjectModel } from '../models/project.model';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService implements OnInit {
  authService = inject(AuthService);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  userSubscription: Subscription;
  router = inject(Router);
  constructor(private firestore: Firestore) {
    this.userSubscription = this.user$.subscribe((user: User | null) => {
      //handle idToken changes here. Note, that user will be null if there is no currently logged in user.
      this.currentUser = user;
      console.log('subssssss', user);
    });
  }
  ngOnInit(): void {
    this.authService.getCurrentUser();
  }

  async createUserProject(
    projectData: ProjectModel
  ): Promise<string | undefined> {
    if (!this.currentUser) {
      console.log('user is null');

      return undefined;
    }

    try {
      const projectsCollectionRef = collection(
        this.firestore,
        `users/${this.currentUser!.uid}/projects`
      );

      const projectRef = await addDoc(projectsCollectionRef, {
        ...projectData,
        createdAt: new Date(),
      });

      console.log('Projet ajouté avec succès, ID:', projectRef.id);

      return projectRef.id;
    } catch (error) {
      console.error('Erreur lors de la création du projet :', error);
      throw error;
    }
  }

  async getAllUserProjects(): Promise<ProjectModel[]> {
    if (!this.currentUser) return [];

    try {
      const projectsCollectionRef = collection(
        this.firestore,
        `users/${this.currentUser.uid}/projects`
      );

      const querySnapshot = await getDocs(projectsCollectionRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProjectModel[];
    } catch (error) {
      console.error('Erreur lors de la récupération des projets :', error);
      throw error;
    }
  }

  async getUserProjectById(projectId: string): Promise<ProjectModel | null> {
    try {
      if (!this.currentUser) {
        console.log('currentUser is null');
        return null;
      }

      const projectDocRef = doc(
        this.firestore,
        `users/${this.currentUser.uid}/projects/${projectId}`
      );

      const projectDoc = await getDoc(projectDocRef);

      if (!projectDoc.exists()) {
        return null;
      }

      return { id: projectDoc.id, ...projectDoc.data() } as ProjectModel;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du projet ${projectId} :`,
        error
      );
      throw error;
    }
  }

  async deleteUserProject(projectId: string): Promise<void> {
    if (!this.currentUser) return;

    try {
      const projectDocRef = doc(
        this.firestore,
        `users/${this.currentUser.uid}/projects/${projectId}`
      );

      await deleteDoc(projectDocRef);
      console.log(`Projet ${projectId} supprimé avec succès`);
    } catch (error) {
      console.error(
        `Erreur lors de la suppression du projet ${projectId} :`,
        error
      );
      throw error;
    }
  }

  async editUserProject(
    projectId: string,
    updatedData: Partial<ProjectModel>
  ): Promise<void> {
    if (!this.currentUser) return;

    try {
      const projectDocRef = doc(
        this.firestore,
        `users/${this.currentUser.uid}/projects/${projectId}`
      );

      await updateDoc(projectDocRef, { ...updatedData, updatedAt: new Date() });

      console.log(`Projet ${projectId} mis à jour avec succès`);
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du projet ${projectId} :`,
        error
      );
      throw error;
    }
  }

  getProjectDescriptionForPrompt(project: ProjectModel) {
    const projectDescription = `
        Projet à analyser :
        - Nom du projet: ${project.name}
        - Description du projet : ${project.description}
        - Type d'application : ${project.type}
        - Contraintes techniques principales : ${project.constraints.join(', ')}
        - Composition de l'équipe : ${project.teamSize} développeurs
        - Périmètre fonctionnel couvert : ${project.scope}
        - Fourchette budgétaire prévue : ${project.budgetIntervals}
        - Publics cibles concernés : ${project.targets}
`;

    return projectDescription;
  }
}
