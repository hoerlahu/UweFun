import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const IS_LOGIN_INITIAL = 0;
const IS_LOGIN_TRUE = 1;
const IS_LOGIN_FALSE = 2;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedInSubject: Subject<boolean>;
  loggedInUser: firebase.User;
  loginState: number = IS_LOGIN_INITIAL;

  constructor(private firebaseAuth: AngularFireAuth,
              private router: Router) {
    this.isLoggedInSubject = new Subject<boolean>();

    firebaseAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.onUserLoggedIn();
        this.loggedInUser = user;
      } else {
        this.onUserLoggedOut();
        this.loggedInUser = null;
      }
    });
  }

  login(email: string, password: string) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.router.navigate(['']);
    });
  }

  logout() {
    this.firebaseAuth.auth.signOut();
  }

  onUserLoggedOut(): void {
    this.isLoggedInSubject.next(false);
    this.loginState = IS_LOGIN_FALSE;
  }
  onUserLoggedIn(): void {
    this.isLoggedInSubject.next(true);
    this.loginState = IS_LOGIN_TRUE;
  }

  signUpWithEmailAndPassword(email: string, password: string): any {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>(
      resolve => {
        if (this.loginState === IS_LOGIN_TRUE) {
          resolve(true);
        } else if (this.loginState === IS_LOGIN_FALSE) {
          resolve(false);
        } else {
          this.isLoggedInSubject.subscribe(
            next => {
              resolve(next);
            }
          );
        }
      }
    );
  }

  getUserId(): string {
    if (this.loggedInUser) {
    return this.loggedInUser.uid;
    } else {
      throw new Error('user is not logged in');
    }
  }
}
