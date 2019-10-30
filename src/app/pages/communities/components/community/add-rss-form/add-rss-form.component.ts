import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { RSS } from '../../../../news/models/rss';
import { Category } from '../../../../news/models/category';
import { Observable } from 'rxjs';
import { NewsService } from '../../../../news/news.service';

@Component({
  selector: 'ngx-add-rss-form',
  templateUrl: './add-rss-form.component.html',
  styleUrls: ['./add-rss-form.component.scss']
})
export class AddRssFormComponent {

  rss: RSS;
  categories : Observable<Category[]>;
  category: string;

  constructor(protected ref: NbDialogRef<AddRssFormComponent>, private newsService: NewsService) {
    this.rss = new RSS();
    this.categories = newsService.getAllCategories();
    this.categories.subscribe();
  }

  selectCategory(value: string) {
    this.category = value.toLowerCase();
  }

  cancel() {
    this.ref.close();
  }

  submit(obj: any) {
    if(obj['0'] != "" && obj['1'] != ""){
      let result = new RSS();
      result.source = obj[0];
      result.url = obj[1];
      result.category = this.category;
      this.ref.close(result);
    } else this.ref.close();
  }

}
