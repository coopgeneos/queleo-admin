import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ngx-news-card-placeholder',
  templateUrl: 'news-card-placeholder.component.html',
  styleUrls: ['news-card-placeholder.component.scss'],
})
export class NewsCardPlaceholderComponent {

  @HostBinding('attr.aria-label')
  label = 'Loading';
}
