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
import { NewsModule } from '../news/news.module';
import { AuthModule } from '../../auth/auth.module';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

//Components
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';
import { FavoritesFilterComponent } from './components/favorites-filter/favorites-filter.component';
import { FavoritesCardPlaceholderComponent } from './components/favorites-card-placeholder/favorites-card-placeholder.component';
import { FavoritesCardComponent } from './components/favorites-card/favorites-card.component';

//Services
import { FavoritesService } from './favorites.service';
import { UsersService } from './users.service';
import { ToastAlertService } from '../../services/toast-alert.service';

// Pipes
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TranslatorPipe } from './pipes/translator.pipe';
import { AuthService } from '../../auth/auth.service';

@NgModule({
  declarations: [
    FavoritesCardPlaceholderComponent,
    FavoritesCardComponent,
    FavoritesListComponent,
    FavoritesFilterComponent,
    CapitalizePipe,
    TranslatorPipe,
    FavoritesCardComponent,
    FavoritesCardPlaceholderComponent,
  ],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(
      {
        apiKey: "AIzaSyAxnLKpUd89lUjH9vDdU6_A4aueAUiKaBk",
        authDomain: "noticion-test.firebaseapp.com",
        databaseURL: "https://noticion-test.firebaseio.com",
        projectId: "noticion-test",
        storageBucket: "noticion-test.appspot.com",
        messagingSenderId: "615542152153",
        appId: "1:615542152153:web:72049b92b8e40527"
      }, 
      'noticion'),
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
    NbButtonModule,
    NewsModule,
    AuthModule
  ],
  //exports: [ CapitalizePipe, TranslatorPipe, FavoritesListComponent ],
  providers: [ FavoritesService, UsersService, ToastAlertService, AuthService ],
 // entryComponents: [ AddFavoriteComponent ]
})
export class FavoritesModule { }
