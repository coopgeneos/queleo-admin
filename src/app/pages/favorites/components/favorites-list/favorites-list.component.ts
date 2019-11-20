import { Component, OnInit, Input } from '@angular/core';
import { NbGlobalPhysicalPosition, NbComponentStatus, NbToastrService, NbDialogRef } from '@nebular/theme';
import { FeedEntry } from '../../../news/models/feed-entry';
import { RSS } from '../../../news/models/rss';
import { FavoritesService } from '../../favorites.service';
import { User } from '../../models/user';
import { Tag } from '../../models/tag';
import { UsersService } from '../../../news/users.service';
import { ToastAlertService } from '../../../../services/toast-alert.service';
import { Favorite } from '../../models/favorite';
import { AuthUser } from '../../../../auth/models/authUser';
import { AuthService } from '../../../../auth/auth.service';
import { database } from 'firebase';

@Component({
  selector: 'ngx-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss']
})
export class FavoritesListComponent implements OnInit {

  @Input() rssPath: string;
  @Input() sourcesPath: string;
  loggedUser: User;
  
  newTags: string = "";
  tags: Tag[]
  title: string;
  filteredFeed: FeedEntry[];


  allFavorites: any;
  listCard = {
    news: [],
    placeholders: [],
    loading: true,
    pageToLoadNext: 1,
  };
  pageSize = 5;

  hiddenFields: string[] = [];

  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];

  newsList: any[] = [];
  filter: any = null;
  
  constructor(private newsService: FavoritesService,
              private toastrService: NbToastrService,
              protected userService: UsersService,
              protected favoriteService: FavoritesService,
              protected toastService: ToastAlertService,
              protected authService: AuthService) {
    if(!this.rssPath) this.rssPath = '/rssx';
    if(!this.sourcesPath) this.sourcesPath = null;
    this.title = "De su interés..."
  }

  async ngOnInit() {
    this.listCard.news = [];
    this.listCard.placeholders = [];

    this.userService.getUserByEmail(this.authService.getLoggedUser().email).subscribe(
      async user => { 
        this.loggedUser = user; 
        this.tags = user.tags ? user.tags : [];
        this.tags.sort((a, b) => {
          if(a.value > b.value) {return 1}
          if(a.value < b.value) {return -1}
          return 0;
        });
        this.listCard.loading = false;
        await this.loadNext(null)
      },
      error => { 
        this.toastService.showAlert('danger', 'Error', 'Hubo un error cargando la pagina');
        console.error(error)
      }
    )
    
  }

  filterFeeds() {
    if(this.filter) {
      if(this.filter.title) {
        this.newsList = this.newsList.filter(news => {
          let result = news.title.toString().toLowerCase().includes(this.filter.title.toLowerCase());
          if(result) return result;
          if(news.description)
            return news.description.toString().toLowerCase().includes(this.filter.title.toLowerCase());
          return result;
        })
      }
      if(this.filter.order == "asc") {
        this.newsList.sort((fa, fb) => {
          if (fa.pubDate < fb.pubDate) return -1;
          if (fa.pubDate > fb.pubDate) return 1;
          return 0;
        })
      } else {
        this.newsList.sort((fa, fb) => {
          if (fa.pubDate < fb.pubDate) return 1;
          if (fa.pubDate > fb.pubDate) return -1;
          return 0;
        })
      }
    }
    this.title = this.newsList.length > 0 ? "De su interés..." : "No hay noticias para ese filtro...";
  }

  /* 
    Estrategia:
    # Traer todas las noticias
    # filtrar las noticias
    # paginar
  */
  async loadNext(filter: any) {
    try {
      if(filter != null) {
        this.filter = filter;
        this.newsList = [];
        this.listCard.news = [];
        this.listCard.pageToLoadNext = 1;
      }

      if (this.listCard.loading) { return; }

      this.listCard.loading = true;
      this.listCard.placeholders = new Array(this.pageSize);

      this.newsList = [];

      await this.loadNews();
      await this.filterFeeds();

      this.paginate(this.listCard.pageToLoadNext, this.pageSize);
      this.listCard.news = this.deleteDuplicated(this.listCard.news, 'link');

      this.listCard.loading = false;
    } catch(err) {
      this.toastService.showAlert('danger', 'Error', err)
    }
  }

  paginate(pageNumber: number, pageSize: number) {
    let from = (pageNumber -1) * pageSize;
    let to = (pageSize * pageNumber) <= this.newsList.length ? (pageSize * pageNumber) : this.newsList.length;
    this.listCard.news = this.listCard.news.concat(this.newsList.slice(from, to));
    this.listCard.pageToLoadNext++;
  }

  deleteDuplicated(original_array: any[], field: string) : any[] {
    let array = [... original_array];
    for(let i=0; i<array.length; i++){
      let jlength = array.length
      for(let j=i+1; j<array.length; j++){
        if(array[i][field] == array[j][field]) {
          array.splice(j, 1);
          j -= 1;
        }
      }
    }
    return array;
  }

  getSingleFeed(fav: Favorite) : Promise<FeedEntry> {
    return new Promise((resolve, reject) => {
      this.favoriteService.getFeedByKey(fav.news).subscribe(
        feed => { 
          resolve(feed)  
        },
        error => {
          reject(error)
        }
      )
    }) 
  }

  loadNews() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.favoriteService.getAllFavorites(this.loggedUser.id).subscribe(
        data => { 
          // Si hay filtro por tags entonces lo aplico aca
          if(this.filter && this.filter.tags) {
            this.allFavorites = data.filter(fav => {
              for(let tagf in fav.tags) {
                for(let i=0; i<this.filter.tags.length; i++) {
                  if(tagf.toLocaleLowerCase() == this.filter.tags[i].toLocaleLowerCase()){
                    return true;
                  }
                }
              }
              return false;
            });
          } else { // Si no me quedo con todos
            this.allFavorites = data;
          }
          
          let promises = []
          this.allFavorites.forEach(element => {
            promises.push(this.getSingleFeed(element))
          });
          Promise.all(promises)
            .then(values => {
              values.forEach(feed => {
                this.newsList.push(feed);

              });
              resolve(true)
            })
            .catch(err => {
              this.toastService.showAlert('danger', 'Error', 'Promesas');
              reject()
            })
        },
        error => {
          reject(error)
        }
      )
    })
  }

}
