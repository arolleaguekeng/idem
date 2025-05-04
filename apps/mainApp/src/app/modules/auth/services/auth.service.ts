import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class AuthService {
  private auth = inject(Auth);
  user$: Observable<User | null>;
  private http = inject(HttpClient); 
  private apiUrl = 'http://localhost:3000/api';
  constructor(private firestore: Firestore) {
    this.user$ = user(this.auth);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password).then(
      async (cred) => {
        await this.sendTokenToBackend();
      }
    );
    return from(promise);
  }

  async loginWithGithub() {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    await this.postLogin(result.user);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    await this.postLogin(result.user);
  }

  private async postLogin(user: User) {
    if (user) {
      await this.createUserDocument(user);
      await this.sendTokenToBackend();
    }
  }

  private async sendTokenToBackend(): Promise<void> {
    const token = await this.auth.currentUser?.getIdToken();

    if (!token) {
      console.error("Impossible d'obtenir le token utilisateur");
      return;
    }

    await this.http
      .post(
        `${this.apiUrl}/sessionLogin`,
        { idToken: token },
        { withCredentials: true }
      )
      .toPromise();
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
    const promise = signOut(this.auth)
      .then(() => {
        sessionStorage.clear();
        return this.http
          .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
          .toPromise();
      })
      .then(() => {});
    return from(promise);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
