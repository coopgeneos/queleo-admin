import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CommunitiesService } from '../../../communities.service';
import { Community } from '../../../models/community';
import { AuthService } from '../../../../../auth/auth.service';
import { ToastAlertService } from '../../../../../services/toast-alert.service';

@Component({
  selector: 'ngx-add-community-form',
  templateUrl: './add-community-form.component.html',
  styleUrls: ['./add-community-form.component.scss']
})
export class AddCommunityFormComponent implements OnInit {

  constructor(
    protected ref: NbDialogRef<AddCommunityFormComponent>,
    protected communitiesService: CommunitiesService,
    protected authService: AuthService,
    protected toastService: ToastAlertService) { }

  ngOnInit() {
  }

  add(name: string, description: string) : void {
    let community = new Community();
    community.name = name;
    community.description = description;
    community.owner = this.authService.getLoggedUser().email;
    this.communitiesService.addCommunity(community)
      .then(() => {this.ref.close()})
      .catch(err => {
        this.toastService.showAlert("danger", "Error", err)
      })
    ;
  }

  cancel() : void {
    this.ref.close();
  }

}
