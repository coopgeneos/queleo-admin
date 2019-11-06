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
