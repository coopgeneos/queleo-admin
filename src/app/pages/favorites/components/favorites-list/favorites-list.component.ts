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

  allFavorites: any;
  listCard = {
    news: [],
    placeholders: [],
    loading: true,
    pageToLoadNext: 1,
  };
  pageSize = 10;

  rssList: RSS[] = [];
  filteredRss: RSS[];

  hiddenFields: string[] = [];

  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  
  constructor(private newsService: FavoritesService,
              private toastrService: NbToastrService,
              protected userService: UsersService,
              protected favoriteService: FavoritesService,
              protected toastService: ToastAlertService) {
    if(!this.rssPath) this.rssPath = '/rssx';
    if(!this.sourcesPath) this.sourcesPath = null;
    this.title = "De su interés..."
  }

  async ngOnInit() {
    this.userService.getUserByEmail("ibgomezo@gmail.com").subscribe(
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

  /* loadRSS() : Promise<any> {
    return new Promise((resolve,reject) => {
      /* this.newsService.loadRss(this.rssPath).subscribe(
        data => {
          this.rssList = data;
          resolve()
        },
        error => {
          reject(error)
        }
      ) 
      this.favoriteService.getAllFavorites(this.loggedUser.id).subscribe(
        data => {
          data.forEach(fav => {this.rssList.push()}) 
        }
      )
    })
  } */

  filterRSS(filter: any) {
    // Aplico filtros que se pueden aplicar sobre RSS: Categorias, fuentes, ocultar campos
    this.filteredRss = [];
    if(filter) {
      this.hiddenFields = filter.hiddenFields ? filter.hiddenFields : [];

      if(filter.sources) {
        filter.sources.forEach(source => {
          this.filteredRss = this.filteredRss.concat(this.rssList.filter(rss => {
            return rss.source == source;
          }))
        })
      } 
        
      if(filter.categories) {
        let filtered = [];
        filter.categories.forEach(categ => {
          filtered = filtered.concat(this.filteredRss.filter(rss => {
            return rss.category == categ;
          }))
        });
        this.filteredRss = filtered; 
      }
    }

    this.filteredRss = filter && filter.sources && filter.categories ? this.filteredRss : [...this.rssList];
  }

  loadSingleFeed(rss: RSS) : Promise<FeedEntry[]> {
    return new Promise((resolve, reject) => {
      this.newsService.getContent(rss).toPromise()
        .then(entries => {
          resolve(entries)
        })
        .catch(err => {
          this.showToast("warning", "Atención!", `No se puediron cargar las noticias de ${rss.source.toUpperCase()}`)
          resolve(null)
        })
    })
  }

  /* loadFeeds() : Promise<any> {
    return new Promise((resolve, reject) => {
      let promises = [];

      this.filteredRss.forEach(rss => { promises.push(this.loadSingleFeed(rss)) })
      Promise.all(promises)
        .then(values => {
          this.listCard.placeholders = [];
          this.listCard.news = [];
          values.forEach(posts => { 
            if(posts)
              this.listCard.news = this.listCard.news.concat([...posts]); 
          })
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
    
  } */

  filterFeeds(filter: any) {
    if(filter) {
      if(filter.title) {
        this.listCard.news = this.listCard.news.filter(news => {
          let result = news.title.toString().toLowerCase().includes(filter.title.toLowerCase());
          if(result) return result;
          if(news.description)
            return news.description.toString().toLowerCase().includes(filter.title.toLowerCase());
            console.log(result)
          return result;
        })
      }
      if(filter.order == "asc") {
        this.listCard.news.sort((fa, fb) => {
          if (fa.pubDate < fb.pubDate) return -1;
          if (fa.pubDate > fb.pubDate) return 1;
          return 0;
        })
      } else {
        this.listCard.news.sort((fa, fb) => {
          if (fa.pubDate < fb.pubDate) return 1;
          if (fa.pubDate > fb.pubDate) return -1;
          return 0;
        })
      }
    }
    this.title = this.listCard.news.length > 0 ? "De su interés..." : "No hay noticias para ese filtro...";
  }

  paginate(from: number, size: number) {
    if(size < this.listCard.news.length) {
      this.listCard.news = this.listCard.news.splice(from -1 , size);
      this.listCard.pageToLoadNext++;
    }
  }

  /* 
    Estrategia:
    # Traer todos los RSS
    # Filtrar los rss
    # Traer todas las noticias
    # filtrar las noticias
    # paginar
  */
  async loadNext(filter: any) {
    try {
      if (this.listCard.loading) { return; }

      this.listCard.loading = true;
      this.listCard.placeholders = new Array(this.pageSize);

      // await this.loadRSS();
      // await this.filterRSS(filter)
      // console.log("RSS filtrados",this.filteredRss)
      if(filter != null) {
        this.listCard.news = [];
        this .listCard.placeholders = [];
        this.listCard.pageToLoadNext = 1;
      }

      await this.chargeNews();
      await this.filterFeeds(filter);
      console.log("Noticias",this.listCard.news)

      this.paginate(this.listCard.pageToLoadNext, this.pageSize);

      this.listCard.loading = false;
    } catch(err) {
      this.showToast('danger', 'Error', err)
    }
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

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 2000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };

    this.toastrService.show(
      body,
      title,
      config);
  }

  getSingleFeed(fav: Favorite) : Promise<FeedEntry> {
    return new Promise((resolve, reject) => {
      this.favoriteService.getFeedByKey(fav.news)/* .toPromise()
        .then(feed => {
          console.log("feed", feed);
          resolve(feed)})
        .catch(err => {
          console.error("error", err);
          reject(err)}) */.subscribe(
        feed => { 
          resolve(feed)  
        },
        error => {
          reject(error)
        }
      )
    }) 
  }

  chargeNews() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.favoriteService.getAllFavorites(this.loggedUser.id).subscribe(
        data => { 
          this.allFavorites = data;
          let promises = []
          this.allFavorites.forEach(element => {
            promises.push(this.getSingleFeed(element))
          });
          Promise.all(promises)
            .then(values => {
              console.log("values", values)
              values.forEach(feed => {
                this.listCard.news.push(feed);
              });
              resolve(true)
            })
            .catch(err => {
              console.log("chargeNews", err)
              this.showToast('danger', 'Error', 'Promesas');
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

