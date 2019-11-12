import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbListModule,
  NbSelectModule, 
  NbCheckboxModule, 
  NbActionsModule, 
  NbInputModule,
  NbDialogModule,
  NbIconModule,
  NbButtonModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { firebaseConfig } from '../../../../../configs/queleo-config';

//Components
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsFilterComponent } from './components/news-filter/news-filter.component';
import { NewsCardPlaceholderComponent } from './components/news-card-placeholder/news-card-placeholder.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import { AddFavoriteComponent } from './components/news-card/add-favorite/add-favorite.component';

//Services
import { NewsService } from './news.service';
import { UsersService } from './users.service';
import { ToastAlertService } from '../../services/toast-alert.service';

// Pipes
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TranslatorPipe } from './pipes/translator.pipe';

@NgModule({
  declarations: [
    NewsCardPlaceholderComponent,
    NewsCardComponent,
    NewsListComponent,
    NewsFilterComponent,
    CapitalizePipe,
    TranslatorPipe,
    NewsCardComponent,
    NewsCardPlaceholderComponent,
    AddFavoriteComponent
  ],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig, 'noticion'),
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbCardModule,
    NbListModule,
    NbSelectModule,
    NbCheckboxModule,
    NbInputModule,
    NbActionsModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
    NbIconModule,
    NbButtonModule
  ],
  exports: [ CapitalizePipe, TranslatorPipe, NewsListComponent, NewsCardPlaceholderComponent ],
  providers: [ NewsService, UsersService, ToastAlertService ],
  entryComponents: [ AddFavoriteComponent ]
})
export class NewsModule { }
