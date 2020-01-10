import { Component, OnInit } from '@angular/core';
import { ProfilesService } from '../../profiles.service';
import { UsersService } from '../../../news/users.service';
import { AuthService } from '../../../../auth/auth.service';
import { Router } from '@angular/router';

import { User } from '../../../news/models/user';
import { Profile } from '../../models/profile';

@Component({
  selector: 'ngx-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent implements OnInit {

  user: User;
  profiles: Profile[] = []

  constructor(
    private profileService: ProfilesService,
    private authService: AuthService,
    private userService: UsersService,
    private router: Router) { }

  ngOnInit() {
    this.userService.getUserByEmail(this.authService.getLoggedUser().email).subscribe(
      data => {
        this.user = data;
        this.profileService.getProfiles(this.user.id).subscribe(
          data => {this.profiles = data},
          error => {console.error(error)}
        )
      },
      error => {console.error(error)}
    )
  }

  goToProfile(index) {
    this.router.navigate(["/pages/profile/"+this.profiles[index].id]);
  }

  viewNews(index) {
    this.router.navigate(["/pages/news"], 
      { queryParams: { 
          rss: `#users#${this.user.id}#profiles#${this.profiles[index].id}#rss`, 
          sources: `#users#${this.user.id}#profiles#${this.profiles[index].id}#sources`
        }
      });
  }

  setAsDefault(index: number) : void {
    
  }

}
