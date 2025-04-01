import { Injectable, OnInit, inject } from '@angular/core';
import { collection } from 'firebase/firestore';

import {
  addDoc,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../../auth/services/auth.service';
import { ProjectModel } from '../models/project.model';
import { User } from '@firebase/auth';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProjectService implements OnInit {
  authService = inject(AuthService);
  currentUser?: User | null;
  auth = inject(Auth);

  constructor(private firestore: Firestore) {}
  ngOnInit(): void {
    // this.currentUser = this.authService.getCurrentUser();
  }

  async createUserProject(
    projectData: ProjectModel
  ): Promise<string | undefined> {
    if (!this.auth.currentUser) {
      console.log('user is null');
      return undefined;
    }

    try {
      const projectsCollectionRef = collection(
        this.firestore,
        `users/${this.auth.currentUser.uid}/projects`
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
    if (!this.currentUser) return null;

    try {
      const projectDocRef = doc(
        this.firestore,
        `users/${this.currentUser.uid}/projects/${projectId}`
      );

      const projectDoc = await getDoc(projectDocRef);

      if (!projectDoc.exists()) return null;

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
}
