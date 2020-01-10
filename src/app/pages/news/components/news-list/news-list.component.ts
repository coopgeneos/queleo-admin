import { Component, OnInit, Input } from '@angular/core';
import { NewsService } from '../../news.service';
import { RSS } from '../../models/rss';
import { NbComponentStatus } from '@nebular/theme';
import { FeedEntry } from '../../models/feed-entry';
import { ToastAlertService } from '../../../../services/toast-alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {

  @Input() rssPath: string;
  @Input() sourcesPath: string;

  title: string;

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

  constructor(
    private newsService: NewsService, 
    private toastrService: ToastAlertService,
    private activatedRouter: ActivatedRoute ) {
      /* this.activatedRouter.params.subscribe(
        params => { 
          console.log("params",params)
          let _rss = params['rss'] ? params['rss'].replace(/#/g,'/') : null;
          let _sources = params['sources'] ? params['sources'].replace(/#/g,'/') : null;
          this.rssPath = _rss; 
          this.sourcesPath = _sources;
        }
      ); */

      

      if(!this.rssPath) this.rssPath = '/rssx';
      if(!this.sourcesPath) this.sourcesPath = null;
      this.title = "De su interés..."
  }

  async ngOnInit() {
    this.activatedRouter.queryParams
        .subscribe(params => {
           // {order: "popular"}
          let _rss = params['rss'] ? params['rss'].replace(/#/g,'/') : null;
          let _sources = params['sources'] ? params['sources'].replace(/#/g,'/') : null;
          this.rssPath = _rss ? _rss : this.rssPath; 
          this.sourcesPath = _sources ? _sources : this.sourcesPath;
          console.log(params, this.rssPath, this.sourcesPath);
        });

    this.listCard.loading = false;
    await this.loadNext(null)
  }

  loadRSS() : Promise<any> {
    return new Promise((resolve,reject) => {
      this.newsService.loadRss(this.rssPath).subscribe(
        data => {
          this.rssList = data;
          resolve()
        },
        error => {
          reject(error)
        }
      )
    })
  }

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
          this.toastrService.showAlert("warning", "Atención!", `No se puediron cargar las noticias de ${rss.source.toUpperCase()}`)
          resolve(null)
        })
    })
  }

  loadFeeds() : Promise<any> {
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
    
  }

  filterFeeds(filter: any) {
    if(filter) {
      if(filter.title) {
        this.listCard.news = this.listCard.news.filter(news => {
          let result = news.title.toString().toLowerCase().includes(filter.title.toLowerCase());
          if(result) return result;
          if(news.description)
            return news.description.toString().toLowerCase().includes(filter.title.toLowerCase());
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
    if(size > this.listCard.news.length) {
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

      await this.loadRSS();
      await this.filterRSS(filter)

      await this.loadFeeds();
      await this.filterFeeds(filter);
      this.paginate(this.listCard.pageToLoadNext, this.pageSize);

      this.listCard.loading = false;
    } catch(err) {
      this.toastrService.showAlert('danger', 'Error', err)
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

}
