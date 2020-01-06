import { Component, OnDestroy, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbMenuItem, NbSearchService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { NbMenuInternalService } from '@nebular/theme/components/menu/menu.service';
import { NewsListComponent } from '../../../pages/news/components/news-list/news-list.component';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'queleo',
      name: 'QueLeo',
    },
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  pagesWithsearch: string[] = ['/pages/news', '/pages/community/'];
  showSearch: boolean = false;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authService: AuthService,
              private router: Router,
              private searchService: NbSearchService) {

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    /* this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick); */

    this.user = this.authService.getLoggedUser();

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.searchService.onSearchSubmit().subscribe(
      data => {
        console.log("header.component.ts - onInit()",data.term);
      })

    this.menuService.onItemClick().subscribe(
      menuBag => {
        if(menuBag.item.title === this.userMenu[1].title) {
          this.authService.logout().then(() => this.router.navigate(["pages"]))
        }
      })

    /* this.router.events.subscribe(
      data => {
        if(data['navigationTrigger'] == "imperative") {
          this.showSearch = false;
          for(let i=0; i<this.pagesWithsearch.length; i++) {
            if(data['url'].includes(this.pagesWithsearch[i])) {
              this.showSearch = true;
              break;
            }
          }
        }
      }
    ) */

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  /* logout() : void {
    this.authService.logout()
      .then(() => this.router.navigate(["pages"]))
  } */

  isLoggedIn() : boolean {
    return this.authService.getLoggedUser() != null;
  }

}
