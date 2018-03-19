import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-ridehistory',
  templateUrl: 'ridehistory.html'
})
export class RideHistoryPage {

  constructor(private navCtrl: NavController) {}

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  goToSignUp() {
    this.navCtrl.push(RegisterPage);
  }
}
