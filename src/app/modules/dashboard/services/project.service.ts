import { Injectable, OnInit, inject } from '@angular/core';
import { collection } from 'firebase/firestore';

import { addDoc, Firestore } from '@angular/fire/firestore';
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
}
