import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert.service';
import { UserIdleService } from 'angular-user-idle';
import { NbDialogService } from '@nebular/theme';
import { IdleUserComponent } from '../idle-user/idle-user.component';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    protected authService: AuthService,
    private router: Router,
    private toastService: ToastAlertService,
    private userIdle: UserIdleService,
    private dialogService: NbDialogService) { }

  ngOnInit() {
    this.userIdle.setConfigValues({idle: 10, timeout: 30, ping: 0})
    this.userIdle.onTimerStart().subscribe(
      time => {
        if(time == 1) {
          this.dialogService.open(IdleUserComponent)
            .onClose.subscribe(result => {
              if(result && result == true) {
                this.userIdle.resetTimer();
              } else {
                this.userIdle.stopTimer();
                this.userIdle.stopWatching();
                this.authService.logout()
                  .then(() => this.router.navigate([""]))
                  .catch(err => console.error("Logout failed"))
              }
            });
        }
      }
    );
  }

  login(data: string[]) : void {
    this.authService.signIn(data[0], data[1])
      .then(() => {
        this.userIdle.startWatching();
        this.router.navigate([""]);
      })
      .catch(err => {
        this.toastService.showAlert('danger', 'Error', 'Las credenciales no pertencen a un usuario')
      })
  }

}
