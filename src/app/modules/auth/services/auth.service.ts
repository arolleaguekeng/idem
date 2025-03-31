import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  afAuth = inject(AngularFireAuth);
  constructor(private firestore: Firestore) {}

  async loginWithGithub() {
    const provider = new GithubAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  auth = inject(Auth);

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then((result) => {
      console.log(result);
      if (result.user) {
        this.createUserDocument(result.user);
      } else {
        console.log('errorr');
      }
    });
  }

  async createUserDocument(user: User) {
    if (!user) return;

    const userRef = doc(collection(this.firestore, 'users'), user.uid);

    const userData = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'Utilisateur',
      photoURL: user.photoURL || null,
      providerId: user.providerData[0]?.providerId || 'unknown',
      createdAt: new Date(),
    };

    try {
      await setDoc(userRef, userData, { merge: true });
      console.log('Utilisateur ajouté à Firestore avec succès');
    } catch (error) {
      console.error(
        'Erreur lors de l’ajout de l’utilisateur à Firestore :',
        error
      );
    }
  }

  async logout() {
    return this.afAuth
      .signOut()
      .then(() => {
        console.log('Utilisateur déconnecté avec succès');
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion', error);
      });
  }

  getCurrentUser() {
    const currentUser = this.auth.currentUser;
    // console.log("Current",currentUser);
    return currentUser;
  }
}
