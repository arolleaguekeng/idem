import { inject, Injectable } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  GithubAuthProvider,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,

  doc,
  setDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firestore: Firestore) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.auth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.auth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password).then(
      () => {
        //
      }
    );
    return from(promise);
  }

  async loginWithGithub() {
    const provider = new GithubAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  user$: Observable<User | null>;

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

  logout(): Observable<void> {
    const promise = signOut(this.auth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
