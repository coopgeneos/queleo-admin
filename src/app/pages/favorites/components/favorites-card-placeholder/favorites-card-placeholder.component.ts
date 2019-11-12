import { Component , HostBinding } from '@angular/core';

@Component({
  selector: 'ngx-favorites-card-placeholder',
  templateUrl: './favorites-card-placeholder.component.html',
  styleUrls: ['./favorites-card-placeholder.component.scss']
})
export class FavoritesCardPlaceholderComponent  {
  @HostBinding('attr.aria-label')
label = 'Loading';
}
