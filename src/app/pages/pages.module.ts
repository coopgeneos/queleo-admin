import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { NewsModule } from './news/news.module';
import { CommunitiesModule } from './communities/communities.module';
import { AuthModule } from '../auth/auth.module'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NewsModule,
    CommunitiesModule,
    AuthModule
  ],
  declarations: [
    PagesComponent,
  ],
  providers: [
    AngularFireAuth, 
    AngularFireAuthGuard
  ]
})
export class PagesModule {
}
