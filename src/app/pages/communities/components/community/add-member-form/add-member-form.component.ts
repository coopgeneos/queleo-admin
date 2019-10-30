import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-add-member-form',
  templateUrl: './add-member-form.component.html',
  styleUrls: ['./add-member-form.component.scss']
})
export class AddMemberFormComponent {

  constructor(protected ref: NbDialogRef<AddMemberFormComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(email) {
    this.ref.close(email);
  }

}
