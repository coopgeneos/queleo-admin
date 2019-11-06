import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    protected authService: AuthService,
    private router: Router,
    private toastService: ToastAlertService) { }

  login(data: string[]) : void {
    this.authService.signIn(data[0], data[1])
      .then(() => {
        this.router.navigate([""]);
      })
      .catch(err => {
        this.toastService.showAlert('danger', 'Error', 'Las credenciales no pertencen a un usuario')
      })
  }

}
