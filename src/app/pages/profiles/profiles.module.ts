import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  NbStepperModule,
} from '@nebular/theme';
import { NewsModule } from '../news/news.module'
import { AuthModule } from '../../auth/auth.module';

//Components
import { ProfileStepperComponent } from './components/profile-stepper/profile-stepper.component';
import { ProfilesListComponent } from './components/profiles-list/profiles-list.component';

//Services
import { ToastAlertService } from '../../services/toast-alert.service';
import { NewsService } from '../news/news.service';
import { UsersService } from '../news/users.service';

@NgModule({
  declarations: [
    ProfileStepperComponent,
    ProfilesListComponent,
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbListModule,
    NbSelectModule, 
    NbCheckboxModule, 
    NbActionsModule, 
    NbInputModule,
    NbDialogModule,
    NbIconModule,
    NbButtonModule,
    NbStepperModule,
    FormsModule, 
    ReactiveFormsModule,
    NewsModule,
    AuthModule,
    RouterModule
  ],
  exports: [ ],
  providers: [ ToastAlertService, NewsService, UsersService ],
  entryComponents: [ ]
})
export class ProfilesModule { }
