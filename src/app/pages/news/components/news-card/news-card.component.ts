import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { FeedEntry } from '../../models/feed-entry';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { AddFavoriteComponent } from './add-favorite/add-favorite.component';

@Component({
  selector: 'ngx-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent implements OnInit {

  @Input() feed: FeedEntry;
  @Input() hiddenFields: string[];

  private urlPrefixes = {
    facebook: "https://www.facebook.com/sharer.php?u=",
    twitter: "https://twitter.com/intent/tweet?url=",
    linkedin: "https://www.linkedin.com/shareArticle?mini=true&url="
  }

  private fav_shared = {
    text: "+1",
    status: "success",
    icon: "minus-circle-outline"
  }

  private fav_not_shared = {
    text: "",
    status: "",
    icon: "plus-circle-outline"
  }

  public status = this.fav_not_shared;

  constructor(private dialogService: NbDialogService) { }

  ngOnInit() { }

  toFavorites() : void {
    let ctx = { feed: this.feed };
    this.dialogService.open(AddFavoriteComponent, {context: ctx})
      .onClose.subscribe(flag => {
        if(flag)
          this.status = this.status == this.fav_not_shared ? this.fav_shared : this.fav_not_shared;
      });
  }

  share(social: string) : void {
    if(this.urlPrefixes[social]) {
      window.open(this.urlPrefixes[social] + this.feed.link, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=500,height=400");
    }
  }
}
