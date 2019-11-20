import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UsersService } from '../../../news/users.service';
import { AuthService } from '../../../../auth/auth.service';
import { ToastAlertService } from '../../../../services/toast-alert.service';
import { FavoritesService } from '../../favorites.service';

@Component({
  selector: 'ngx-favorites-filter',
  templateUrl: './favorites-filter.component.html',
  styleUrls: ['./favorites-filter.component.scss']
})
export class FavoritesFilterComponent implements OnInit {

  @Output() updateFilter = new EventEmitter();
  @Input() sourcesPath: string;

  filterTitle: string = "";
  categories: any[];
  sources: any[];
  tags: any[];
  loggedUser: any;

  order: string = "desc";
  hiddenFields: any[] = [
    {name:"title", selected: false},
    {name:"image", selected: false},
    {name:"description", selected: false},
    {name:"data", selected: false},
  ];

  timer: NodeJS.Timer;

  constructor(private firebaseDB: AngularFireDatabase,
              protected userService: UsersService,
              protected toastService: ToastAlertService,
              protected favoriteService: FavoritesService,
              protected authService: AuthService) 
              { }

  async ngOnInit() {
    if(!this.sourcesPath) {this.sourcesPath = "/sources"};
    this.userService.getUserByEmail(this.authService.getLoggedUser().email).subscribe(
      async user => { 
        this.loggedUser = user; 
        this.loggedUser.id = user.id
        this.tags = user.tags ? user.tags : [];
        this.tags.sort((a, b) => {
          if(a.value > b.value) {return 1}
          if(a.value < b.value) {return -1}
          return 0;
        });
        this.loadTags();
      },
      error => { 
        this.toastService.showAlert('danger', 'Error', 'Hubo un error cargando la pagina');
        console.error(error)
      }
    )
    
  }
    
  

  
  loadTags() : void {
    
        
    this.tags.forEach(tag => { tag['selected']  = false ;
      
    });        
  }

  filter() : void {
    let filter = { order: this.order };
    if(this.filterTitle != ""){
      filter['title'] = this.filterTitle;
    }

    let tags_f = this.tags.filter(tag => { return tag.selected })
    tags_f = tags_f.length > 0 ? tags_f.map(tag => { return tag.value }) : [];
    if(tags_f.length > 0) {
      filter['tags'] = tags_f;
    }

   /*  let cat_f = this.categories.filter(cat => { return cat.selected })
    cat_f = cat_f.length > 0 ? cat_f.map(cat => { return cat.name }) : [];
    if(cat_f.length > 0) {
      filter['categories'] = cat_f; 
    } */

    let hidden_f = this.hiddenFields.filter(field => { return field.selected })
    hidden_f = hidden_f.length > 0 ? hidden_f.map(field => { return field.name }) : [];
    if(hidden_f.length > 0) {
      filter['hiddenFields'] = hidden_f;
    }

    console.log("feed-filter", filter)
    this.updateFilter.emit(filter);
  }

  filterByTitle(value: string) : void {
    this.filterTitle = value;
    clearTimeout(this.timer);
    this.setTimer();
  }

  

  changeOrder(value: string) : void {
    this.order = value;
    clearTimeout(this.timer);
    this.setTimer();
  }

  hiddeField(index: number, selected: boolean) : void {
    this.hiddenFields[index].selected = selected;
    clearTimeout(this.timer);
    this.setTimer();
  }
  selectTag(index: number, selected: boolean) : void {
    this.tags[index].selected = selected;
    clearTimeout(this.timer);
    this.setTimer();
  }

  setTimer() : void {
    this.timer = setTimeout(() => {
      this.filter();
    }, 2000);
  }

  resetTimer() : void {
    if(this.timer != null)
      clearTimeout(this.timer)
  }

}