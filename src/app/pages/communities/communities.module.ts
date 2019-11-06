import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbListModule,
  NbSelectModule, 
  NbCheckboxModule, 
  NbActionsModule, 
  NbInputModule,
  NbDialogModule,
  NbButtonModule
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { NewsModule } from '../news/news.module';

//Components
import { CommunityCardComponent } from './components/community-card/community-card.component';
import { CommunityListComponent } from './components/community-list/community-list.component';
import { CommunityComponent } from './components/community/community.component';
import { AddMemberFormComponent } from './components/community/add-member-form/add-member-form.component';
import { AddRssFormComponent } from './components/community/add-rss-form/add-rss-form.component';

//Services
import { CommunitiesService } from './communities.service';
import { NewsService } from '../layout/news.service';
import { ToastAlertService } from '../../services/toast-alert.service'

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

@NgModule({
  declarations: [
    CommunityCardComponent, 
    CommunityListComponent, 
    CommunityComponent, 
    AddMemberFormComponent, 
    AddRssFormComponent
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
    NbCardModule,
    NbListModule,
    NbSelectModule, 
    NbActionsModule, 
    NbInputModule,
    NbButtonModule,
    ThemeModule,
    NewsModule,
    NbDialogModule.forChild(),
  ],
  providers: [ 
    CommunitiesService, 
    NewsService,
    ToastAlertService
  ],
  entryComponents: [ 
    AddMemberFormComponent, 
    AddRssFormComponent 
  ],
})
export class CommunitiesModule { }
