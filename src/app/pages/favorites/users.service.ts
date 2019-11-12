import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { map } from 'rxjs/operators';
import { Tag } from './models/tag';
import { Favorite } from './models/favorite';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firebaseDB: AngularFireDatabase) { }

  getUser(id: string) : Observable<User> {
    return this.firebaseDB.object('/users/'+ id).snapshotChanges().pipe(
      map(obj => {
        if(obj) {
          let user = new User();
          user._init(obj);
          return user;
        } else return null
      })
    )
  }

  getUserByEmail(email: string) : Observable<User> {
    try {
      return this.firebaseDB.list<User>('/users', ref => ref.orderByChild('email').equalTo(email))
        .snapshotChanges().pipe(
          map(result => {
            if(result && result.length > 0) {
              let user = new User();
              user._init(result[0].payload.val());
              user.id = result[0].key;
              return user;
            } else return null;
          })
        )
    } catch(err) {
      throw err;
    }
  }

  getTagsOfUser(id: string) : Observable<Tag[]> {
    return this.firebaseDB.list<Tag>('/users/' + id + '/tags').snapshotChanges().pipe(
      map(result => {
        return result.map(rtag => {
          let tag = new Tag();
          tag._init(rtag);
          return tag;
        })
      })
    )
  }

  setTags(id: string, tags: Tag[]) : Promise<void> {
    try {
      return this.firebaseDB.object(`/users/${id}/tags`).set(tags);
    } catch(err) {
      throw err;
    }
  }

  getFavoritesOfUser(id: string) : Observable<Favorite[]> {
    return this.firebaseDB.list<Favorite>('/users/' + id + '/favorites').snapshotChanges().pipe(
      map(result => {
        return result.map(rfav => {
          let fav = new Favorite();
          fav._init(rfav);
          return fav;
        })
      })
    ) 
  }

  setFavoriteToUser(id: string, favorite: Favorite) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.firebaseDB.list(`/users/${id}/favorites`).push(favorite)
        .then(ref => resolve(ref.key))
        .catch(err => reject(err))
    })
  }
}
