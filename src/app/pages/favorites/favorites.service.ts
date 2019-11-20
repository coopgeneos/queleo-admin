import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { RSS } from './models/rss';
import { FeedEntry } from './models/feed-entry';
import { HttpClient } from '@angular/common/http';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { Category } from './models/category';
import { Favorite } from './models/favorite';
import { User } from '../news/models/user';
import { Tag } from '../news/models/tag';

@Injectable()
export class FavoritesService {
  
  private CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
  private parser = new DOMParser();

  constructor(
    private firebaseDB: AngularFireDatabase,
    private http: HttpClient,
    private ngxXml2jsonService: NgxXml2jsonService
  ) { }

  getAllCategories() : Observable<Category[]> {
    try {
      return this.firebaseDB.list<Category>('/categories').snapshotChanges().pipe(
        map(list => {
          return list.map(categ => {
            let category = new Category();
            category._init(categ);
            return category;
          })
        })
      )
    } catch(err) {
      throw err
    }
  }

  loadRss(path: string): Observable<RSS[]> {
    return this.firebaseDB.list<RSS>(path).snapshotChanges().pipe(
      map(rssList => {
        return rssList.map(rss => {
          let elem = new RSS();
          elem._init(rss.payload.val());
          return elem;
        })
      })
    )
  }

  getContent(rss: RSS) : Observable<FeedEntry[]> {
    try {
      return this.http.get(this.CORS_PROXY + rss.url, {responseType: 'text'}).pipe(
        map(xml => {return this.repairXML(xml)}),
        map(xml_s => {return this.parser.parseFromString(xml_s, 'text/xml')}),
        map(xml_p => {return this.ngxXml2jsonService.xmlToJson(xml_p)}),
        map(json => {return this.parseToRSSJson(json, rss)})
      )
    } catch(err) {
      throw err;
    }
  }

  getAllFavorites(id: string) : Observable<Favorite[]> {
    return this.firebaseDB.list('users/'+id+'/favorites').snapshotChanges().pipe(
      map(list => {
        return list.map(row => {
          let fav = new Favorite();
          fav._init(row.payload.val());
          fav.id = row.key;
          return fav;
        })
      })
    )
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
  

  getFeedByKey(key: string) : Observable<FeedEntry> {
    return this.firebaseDB.object('news/'+key).snapshotChanges().pipe(
      map(result => {
        if(result) {
          let feed = new FeedEntry();
          feed._init(result.payload.val());
          feed.creator = result.payload.val()['creator'];
          feed.guid = result.key;
          return feed
        } else return null;
      })
    )
  }
  
  private repairXML(xml: string) : string {
    let fixed = xml.replace(/<!\[CDATA\[|\]\]>/g, "");
    fixed = fixed.toString().replace(/&/g, "&amp;");
    return fixed;
  }

  private parseToRSSJson(json: any, rss: RSS) : FeedEntry[] {
    try {
      let items = this.getItems(json);
      return items.map(item => {
        let feed = new FeedEntry();
        feed._init(item);
        this.fixFeedEntry(feed, item, rss)
        return feed;
      });
    } catch(err) {
      throw ` Error parsing: ${rss.source}
              ${rss.url} 
              ${err}`;
    }
  }

  private getItems(json: any) : any[] {
    if(json.rss && json.rss.channel && json.rss.channel.item){
      // console.log(this.getValueOf(json, 'json.rss.channel.item'));
      return json.rss.channel.item;
    }
      
    if(json.feed && json.feed.entry){
      // console.log(this.getValueOf(json, 'json.feed.entry'));
      return json.feed.entry;
    }
  }

  private fixFeedEntry(feed: FeedEntry, obj: any, rss: RSS) : void {
    // Fix creator
    if(feed.creator == null) {
      feed.creator = this.getValueOf(obj, 'author.name');
      feed.creator = feed.creator ? feed.creator : rss.source;
    } 
    // Fix pubDate
    if(feed.pubDate == null) {
      feed.pubDate = obj['updated'] ? new Date(obj['updated']) : null;
    }
    // Fix link
    if(typeof feed.link != 'string') {
      feed.link = this.getValueOf(obj, 'link.@attributes.href');
    }
    // Fix image
    if(feed.image == null) {
      feed.image = this.getValueOf(obj, 'content.div.img.@attributes.src');
    }
  }

  private getValueOf(obj: any, prop: string) : any {
    let props = prop.split(".");
    let intermediate = 'obj';
    try {
      for(let i=0; i<props.length; i++){
        intermediate = intermediate + `['${props[i]}']`;
        if(eval(intermediate) === 'undefined')
          throw `${intermediate} is undefined`
      }
      return eval(intermediate)
    } catch(err) {
      return null;
    }
  }
}
