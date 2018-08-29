import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController, ViewController, NavParams } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { RegisterPage } from '../register/register';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html'
})

export class ResetPage implements OnInit {
  @ViewChild(Slides) slides: Slides;

  email: string;
  token: string;
  new_password1: string;
  new_password2: string;
  error_message: string;
  public response: any = {};

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService, public viewCtrl: ViewController, public params: NavParams) {
  }

  ngOnInit() {
    this.slides.lockSwipes(true);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public reset() {
    this.httpClient.post(this.config.getAPILocation() + '/forgot', {email: this.email}).subscribe(data => {
      this.response = data;
      if(this.response.success==true) {
        console.log("success");
        let alert = this.alertCtrl.create({
          title: 'Please check your email for a token.',
          buttons: ['OK']
        });
        alert.present();
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
        this.error_message = "";
      } else {
        this.error_message = this.response.message;
      }
    }, error => {
      this.error_message = "Cannot connect to server."
    });
  }

  public updatePassword() {
    this.httpClient.post(this.config.getAPILocation() + '/reset', {token: this.token, newPassword: this.new_password1, confirmNewPassword: this.new_password2}).subscribe(data => {
      this.response = data;
      if(this.response.success==true) {
        let alert = this.alertCtrl.create({
          title: 'Password successfully reset! Please login to continue.',
          buttons: ['OK']
        });
        alert.present();
        this.viewCtrl.dismiss();
        this.error_message = "";
      } else {
        this.error_message = this.response.message;
      }
    }, error => {
      this.error_message = "Cannot connect to server."
    });
  }
}
