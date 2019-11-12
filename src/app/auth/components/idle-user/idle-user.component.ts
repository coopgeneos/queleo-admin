import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-idle-user',
  templateUrl: './idle-user.component.html',
  styleUrls: ['./idle-user.component.scss']
})
export class IdleUserComponent implements OnInit {

  time: number = 30;

  constructor(protected ref: NbDialogRef<IdleUserComponent>) { }

  ngOnInit() {
    setTimeout(() => {this.ref.close(false)}, this.time * 1000)
  }

  continue() : void {
    this.ref.close(true);
  }

}
