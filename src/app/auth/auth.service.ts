import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthUser } from './models/authUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    protected afAuth: AngularFireAuth,
    protected firebaseDB: AngularFireDatabase) {  }

  signIn(email: string, password: string) : Promise<boolean> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        // localStorage.setItem("logged", email);
        return true;
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          throw('Wrong password.');
        } else {
          throw(errorMessage);
        }
      });
  }

  signUp(email: string, password: string) : Promise<boolean> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        return this.firebaseDB.list('/users').push({email: email})
      })
      .then(() => {
        return true;
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          throw('The password is too weak.');
        } else {
          throw(errorMessage);
        }
      });
  }

  logout() : Promise<boolean>  {
    return this.afAuth.auth.signOut()
      .then(() => {
        // localStorage.removeItem("logged");
        return true
      })
      .catch(err => {
        throw err
      })
  }

  getLoggedUser() : AuthUser {
    // let logged = localStorage.getItem("logged")
    let logged = this.afAuth.auth.currentUser;
    if(logged) {
      let user = new AuthUser();
      user.email = logged.email;
      user.name = logged.email.substring(0, logged.email.indexOf('@'));
      return user;
    }
    return null;
  }
}
