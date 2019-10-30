import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UsersService } from '../../../users.service';
import { User } from '../../../models/user';
import { Tag } from '../../../models/tag';
import { Favorite } from '../../../models/favorite';
import { NewsService } from '../../../news.service';
import { FeedEntry } from '../../../models/feed-entry';
import { ToastAlertService } from '../../../../../services/toast-alert.service';

@Component({
  selector: 'ngx-add-favorite',
  templateUrl: './add-favorite.component.html',
  styleUrls: ['./add-favorite.component.scss']
})
export class AddFavoriteComponent implements OnInit {

  private initial_weight = 1;

  feed: FeedEntry;

  loggedUser: User;
  newTags: string = "";
  tags: Tag[]

  constructor(
    protected dialogRef: NbDialogRef<AddFavoriteComponent>,
    protected userService: UsersService,
    protected newsService: NewsService,
    protected toastService: ToastAlertService
  ) { }

  ngOnInit() {
    this.feed = this.dialogRef.componentRef.instance['feed'];

    this.userService.getUserByEmail("ibgomezo@gmail.com").subscribe(
      user => { 
        this.loggedUser = user; 
        this.tags = user.tags ? user.tags : [];
        this.tags.sort((a, b) => {
          if(a.value > b.value) {return 1}
          if(a.value < b.value) {return -1}
          return 0;
        })
      },
      error => { 
        this.toastService.showAlert('danger', 'Error', 'Hubo un error cargando la pagina');
        console.error(error)
      }
    )
  }

  addTag(tag: string) {
    this.newTags = this.newTags.length == 0 ? tag : this.newTags + " " + tag;
  }

  getStyle(i: number) {
    let tag = this.tags[i];
    let style = {
      'font-size.px': 9 + tag.weight > 20 ? 20 : 9 + tag.weight, //Tamaños entre 10 y 20
    }
    return style;
  }

  addToFavorite() {
    this.addFavoriteToUser(this.addTagsToUser());
    let flag = this.newTags.length > 0;
    this.dialogRef.close(flag);
  }

  private addFavoriteToUser(tags: string[]) : void {
    let fav = new Favorite();

    this.newsService.getFeedByLink(this.feed.link).subscribe(
      async _feed => {
        if(_feed) {
          this.feed = _feed;
        } else {
          this.feed.guid = await this.newsService.addFeed(this.feed);
        }

        fav.news = this.feed['guid'];
        fav.tags = tags.reduce((result, current) => { 
          result[current] = true;
          return result;
        }, {});

        this.userService.setFavoriteToUser(this.loggedUser.id, fav)
      },
      error => {
        this.toastService.showAlert('danger', 'Error', 'Hubo un error al guardar el favorito');
        console.error(error)
      }
    )
  }

  private addTagsToUser() : string[] {
    if(this.newTags.length > 0) {
      let _tags = this.newTags.toLocaleLowerCase().split(" ");
      _tags = this.deleteEmpties(_tags);
      _tags = this.deleteDuplicated(_tags);
      _tags.forEach(tag => {
        let found = this.tags.find(elem => { return elem.value == tag });
        if(found) {
          found.weight++;
        } else {
          let nTag = new Tag();
          nTag.value = tag;
          nTag.weight = this.initial_weight;
          this.tags.push(nTag)
        }
      })
      this.userService.setTags(this.loggedUser.id, this.tags);
      return _tags;
    }
  }

  private deleteEmpties(original_array: string[]) : string[] {
    let array = [... original_array];
    for(let i=0; i<array.length; i++) {
      if(array[i] == "") {
        array.splice(i, 1);
        i -= 1; 
      }
    }
    return array;
  }

  private deleteDuplicated(original_array: string[]) : string[] {
    let array = [... original_array];
    for(let i=0; i<array.length; i++){
      for(let j=i+1; j<array.length; j++){
        if(array[i] == array[j]) {
          array.splice(j, 1);
          j -= 1;
        }
      }
    }
    return array;
  }
}
