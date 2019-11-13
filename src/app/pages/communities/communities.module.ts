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
import { AddCommunityFormComponent } from './components/community-list/add-community-form/add-community-form.component';

//Services
import { CommunitiesService } from './communities.service';
import { NewsService } from '../layout/news.service';
import { ToastAlertService } from '../../services/toast-alert.service'

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { firebaseConfig } from '../../../../../configs/queleo-config';

@NgModule({
  declarations: [
    CommunityCardComponent, 
    CommunityListComponent, 
    CommunityComponent, 
    AddMemberFormComponent, 
    AddRssFormComponent,
    AddCommunityFormComponent
  ],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig, 'noticion'),
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
    AddRssFormComponent,
    AddCommunityFormComponent 
  ],
})
export class CommunitiesModule { }
