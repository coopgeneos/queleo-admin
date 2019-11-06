import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastAlertService } from '../../../services/toast-alert.service';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    protected authService: AuthService,
    private router: Router,
    private toastService: ToastAlertService) { }

  register(data: string[]) : void {
    if(data[1] != data[2]) {return this.toastService.showAlert('danger', 'Error', 'Different passwords!')}
    this.authService.signUp(data[0], data[1])
      .then(() => {this.router.navigate(['/pages'])})
      .catch(err => {
        this.toastService.showAlert('danger', 'Error', err)
      })
  }

}
