import { Component, OnInit, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { FeedEntry } from '../../../favorites/models/feed-entry';

@Component({
  selector: 'ngx-favorites-card',
  templateUrl: './favorites-card.component.html',
  styleUrls: ['./favorites-card.component.scss']
})
export class FavoritesCardComponent implements OnInit {
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

  ngOnInit() {
   }

  

  share(social: string) : void {
    if(this.urlPrefixes[social]) {
      window.open(this.urlPrefixes[social] + this.feed.link, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=500,height=400");
    }
  }
}
