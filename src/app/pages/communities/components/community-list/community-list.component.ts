import { Component, OnInit } from '@angular/core';
import { Community } from '../../models/community';
import { CommunitiesService } from '../../communities.service';
import { Observable } from 'rxjs';
import { AuthUser } from '../../../../auth/models/authUser';
import { AuthService } from '../../../../auth/auth.service';
import { NbDialogService } from '@nebular/theme';
import { AddCommunityFormComponent } from './add-community-form/add-community-form.component';

@Component({
  selector: 'ngx-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {

  loggedUser: AuthUser;
  communities: Observable<Community[]>;

  constructor(
    private communitiesService: CommunitiesService,
    private authService: AuthService,
    private dialogService: NbDialogService) { }

  ngOnInit() {
    this.loggedUser = this.authService.getLoggedUser()
    this.communities = this.communitiesService.getAllCommunities(this.loggedUser.email);
    this.communities.subscribe();
  }

  addCommunity() : void {
    this.dialogService.open(AddCommunityFormComponent)
      .onClose.subscribe(() => {
        this.communities.subscribe();
      });
  }

}
