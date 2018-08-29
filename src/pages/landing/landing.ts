import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { ModalController, NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { RegisterPage } from '../register/register';
import { HomePage } from '../../pages/home/home';
import { ResetPage } from '../../pages/reset/reset';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})

export class LandingPage {

  constructor(public modalCtrl: ModalController, private navCtrl: NavController, private httpClient: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private config: ConfigService, private iam: IAMService,) {}
  error_message: string;

  email: string;
  password: string;
  public response: any = {};

  login() {
    // if the inputs are not blank
    if (this.email && this.password) {
      this.error_message = "";

      // display loader
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      //this.navCtrl.setRoot(HomePage);
      // make request to API to check login details

      this.httpClient.post(this.config.getAPILocation() + '/login', {email: this.email, password: this.password}).subscribe(data => {

        loading.dismiss();
        this.response = data;
        console.log(this.response);

        // if there is a successful response
        if (this.response.success==true) {
          // remove surrounding quotes
          //data = data.substring(1, data.length - 1);
          // set the current user in localstorage to this user
          this.iam.setCurrentUser(this.response);
          // move to the main page
          this.navCtrl.setRoot(HomePage);
        } else {
          // display error that login was unsuccessful
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: this.response.message,
            buttons: ['OK']
          });
          alert.present();
        }
      }, error => {
        loading.dismiss();
        if(error.error.success==false) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: error.error.message,
            buttons: ['OK']
          });
          alert.present();
        } else {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Could not connect to server.',
            buttons: ['OK']
          });
          alert.present();
        }
      });
    } else {
      this.error_message = "Please fill out all fields";
    }
  }

  public forgot() {
    console.log("forgot");
    const modal = this.modalCtrl.create(ResetPage);
    modal.present();
  }

  public signup() {
    this.navCtrl.push(RegisterPage);
  }

}
