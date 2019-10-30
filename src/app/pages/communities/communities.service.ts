import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Community } from './models/community';
import { RSS } from '../news/models/rss';
import { User } from '../news/models/user';

@Injectable({
  providedIn: 'root'
})
export class CommunitiesService {

  constructor(private firebaseDB: AngularFireDatabase) { }

  getCommunity(id: string) : Observable<Community> {
    try {
      return this.firebaseDB.object('/communities/' + id).snapshotChanges().pipe(
        map(result => { return this.mapToCommunity(result) })
      )
    } catch(err) {
      throw err;
    }
  }

  getAllCommunities(email: string) : Observable<Community[]> {
    try{
      return this.firebaseDB.list('/communities').snapshotChanges().pipe(
        map(rows => {
          return rows.map(row => 
            this.mapToCommunity(row)
          )
        }),
        map(communities => {return this.filter(email, communities)})
      )
    } catch(err) {
      throw err;
    }
  }

  setMembers(id: string, members: string[]) : void {
    try {
      this.firebaseDB.object(`/communities/${id}/members`).set(members);
    } catch(err) {
      throw err;
    }
  }

  setRss(id: string, rssList: RSS[]) : void {
    try {
      this.firebaseDB.object(`/communities/${id}/rss`).set(rssList);
    } catch(err) {
      throw err;
    }
  }

  setSources(id: string, sources: string[]) : void {
    try {
      this.firebaseDB.object(`/communities/${id}/sources`).set(sources);
    } catch(err) {
      throw err;
    }
  }

  getUserByEmail(email: string) : Observable<User> {
    try {
      return this.firebaseDB.list<User>('/users', ref => ref.orderByChild('email').equalTo(email))
        .snapshotChanges().pipe(
          map(result => {
            if(result && result.length > 0) {
              let user = new User();
              user._init(result[0]);
              return user;
            } else return null;
          })
        )
    } catch(err) {
      throw err;
    }
  }

  private mapToCommunity = function (row: any) : Community {
    let c = new Community();
    c._init(row.payload.val());
    c.id = row.key;
    return c;
  }

  private filter(email: string, communities: Community[]) : Community[] {
    let byOwner = communities.filter(c => {
      return c.owner == email
    });
    let byMember = communities.filter(c => {
      return c.members.includes(email)
    });
    let result: Community[] = byOwner.concat(byMember);
    result = this.deleteDuplicated(result, 'id');
    return result;
  }

  private deleteDuplicated(original_array: any[], field: string) : any[] {
    let array = [... original_array];
    for(let i=0; i<array.length; i++){
      for(let j=i+1; j<array.length; j++){
        if(array[i][field] == array[j][field]) {
          array.splice(j, 1);
          j -= 1;
        }
      }
    }
    return array;
  }
}
