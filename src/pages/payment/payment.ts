import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {

  constructor(private navCtrl: NavController) {}

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  goToSignUp() {
    this.navCtrl.push(RegisterPage);
  }
}
