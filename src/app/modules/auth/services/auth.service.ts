import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  firestore = inject(AngularFirestore);
  afAuth = inject(AngularFireAuth);
  constructor() {}

  async loginWithGithub() {
    // const provider = new GithubAuthProvider();
    // await signInWithPopup(this.auth, provider);
  }

  auth = inject(Auth);

  async loginWithGoogle() {
    // const provider = new GoogleAuthProvider();
    // signInWithPopup(this.auth, provider).then((result) => {
    //   console.log(result);
    //   if (result.user) {
    //     this.createUserDocument(result.user);
    //   } else {
    //     console.log('errorr');
    //   }
    // });
  }

  createUserDocument(user: User) {
    if (!user) return;

    const userRef = this.firestore.collection('users').doc(user.uid);

    const userData = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'Utilisateur',
      photoURL: user.photoURL || null,
      providerId: user.providerData[0]?.providerId || 'unknown',
      createdAt: new Date(),
    };

    return userRef.set(userData, { merge: true });
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
}
