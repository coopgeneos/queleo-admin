import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Profile } from '../profiles/models/profile'

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  private CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
  private parser = new DOMParser();

  constructor(
    private firebaseDB: AngularFireDatabase,
    private http: HttpClient
  ) { }

  getProfiles(userId: string) : Observable<Profile[]> {
    return this.firebaseDB.list(`/users/${userId}/profiles`).snapshotChanges().pipe(
      map(profiles => {
        return profiles.map(profile => {
          let elem = new Profile();
          elem.id = profile.key;
          elem._init(profile.payload.val());
          return elem;
        })
      })
    )
  }

  addProfileToUser(id: string, profile: Profile) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.firebaseDB.list(`/users/${id}/profiles`).push(profile)
        .then(ref => resolve(ref.key))
        .catch(err => reject(err))
    })
  }

  updateProfileToUser(id: string, profile: Profile) : void {
    /* return new Promise((resolve, reject) => {
      this.firebaseDB.list(`/users/${id}/profiles/${profile.id}`).update(null, profile)
        .then(ref => resolve("ok"))
        .catch(err => reject(err))
    }) */

    try {
      let _profId = profile.id;
      delete profile.id;
      this.firebaseDB.object(`/users/${id}/profiles/${_profId}`).set(profile)
    } catch(err) {
      throw err;
    }
  }
}
