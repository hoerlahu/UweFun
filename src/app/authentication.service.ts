import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';

const IS_LOGIN_INITIAL : number = 0;
const IS_LOGIN_TRUE : number = 1;
const IS_LOGIN_FALSE : number = 2;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>(
      resolve => {
        if(this.loginState === IS_LOGIN_TRUE){
          resolve(true);
        } else if(this.loginState === IS_LOGIN_FALSE) {
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
 
  isLoggedInSubject : Subject<boolean>;

  loginState : number = IS_LOGIN_INITIAL;

  constructor(private firebaseAuth : AngularFireAuth) { 
    this.isLoggedInSubject = new Subject<boolean>();
    
    firebaseAuth.auth.onAuthStateChanged((user) => {
      if(user){
        this.onUserLoggedIn();
      } else {
        this.onUserLoggedOut();
      }
    });
  }

  login(email : string, password : string){
    console.log(email + " " + password);
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
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
}
