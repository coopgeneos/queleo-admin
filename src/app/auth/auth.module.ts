import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbLayoutModule
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ToastAlertService } from '../services/toast-alert.service';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from '../../../../configs/queleo-config';

//Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './auth.component';

//Services
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    LoginComponent, 
    RegisterComponent, 
    AuthComponent  
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig, 'noticion'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ThemeModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbLayoutModule
  ],
  providers: [AuthService, AngularFireAuth, ToastAlertService]
})
export class AuthModule { }
