import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  @ViewChild(Slides) slides: Slides;

  // data the hooks up to the input models
  access_code: string = "";
  firstName: string = "";
  lastName: string = "";
  username: string = "";
  password_1: string = "";
  password_2: string = "";
  email: string = "";
  numFamily: string = "";

  error_message: string = "";

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private httpClient: HttpClient, private alertCtrl: AlertController, private config: ConfigService, private iam: IAMService) {}

  ngOnInit() {
    // lock the slides so the user can't swipe them
    this.slides.lockSwipes(true);
  }

  next() {
    // unlock slides temporarily so we can manually move them
    this.slides.lockSwipes(false);

    // if we are on the first slide, attempt to verify access code
    if (this.slides.getActiveIndex() == 0) {
      this.slides.slideNext();
      /*
      // if the input isn't blank
      if (this.access_code) {
        // clear error message
        this.error_message = "";

        // display loading
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();

        // make request to verify access code
        this.httpClient.post(this.config.getAPILocation() + '/accessCodes', {code: this.access_code}, {responseType: 'text'}).subscribe(data => {
          loading.dismiss();

          // if the response is what we want, move to next part of signup
          if (data == "valid code") {
            this.slides.slideNext();
          } else {
            // otherwise, display error message
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Your access code was not valid.',
              buttons: ['OK']
            });
            alert.present();
          }
          this.slides.lockSwipes(true);
        });
      } else {
        this.error_message = "Please fill out all fields";
      }*/
    }
  }

  // main method called when users attemts to sign up
  signUp() {
    // make sure user typed something into all inputs
    if (this.firstName && this.lastName && this.username && this.password_1 && this.password_2 && this.email && this.numFamily) {
      // all fields were filled out
      if (this.password_1 == this.password_2) {
        // password confirmations were the same

        // clear error message
        this.error_message = "";

        // display loading
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();

        // setup body to post to API
        let body = {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password_1,
          email: this.email,
          code: this.access_code,
          numFamily: this.numFamily
        }

        // post data to API endpoint to signup
        this.httpClient.post(this.config.getAPILocation() + "/user/signup", body, {responseType: 'text'}).subscribe(data => {
          loading.dismiss();

          // if we got a response
          if (data) {
            // successful user registration, data equals user id
            data = data.substring(1, data.length - 1);

            // set the current localStorage user_id so we can remember them for login
            this.iam.setCurrentUser(data);

            // move them to the main page
            this.navCtrl.setRoot(TabsPage);
          } else {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Sign up failed.',
              buttons: ['OK']
            });
            alert.present();
          }
        });

      } else {
        this.error_message = "Passwords do not match";
      }
    } else {
      // all fields were not filled out
      this.error_message = "Please fill out all fields";
    }
  }
}
