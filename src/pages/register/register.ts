import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { HomePage } from '../../pages/home/home'
import { LoginPage } from '../../pages/login/login'

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  // data the hooks up to the input models
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  password_1: string = "";
  password_2: string = "";
  birthday: string = "";
  error_message: string = "";
  public response: any = {};

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private httpClient: HttpClient, private alertCtrl: AlertController, private config: ConfigService, private iam: IAMService) {}

  // main method called when users attemts to sign up
  signUp() {
    // make sure user typed something into all inputs
    if (this.firstName && this.lastName && this.email && this.password_1 && this.password_2) {
      // all fields were filled out
      if(this.password_1.length<6) {
        this.error_message = "Password must be at least 6 characters long.";
      }
      else if (this.password_1 == this.password_2) {
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
          first_name: this.firstName,
          last_name: this.lastName,
          new_password: this.password_1,
          email: this.email
        }
        console.log(body);
        let birthdayArray = this.birthday.split('-');
        let year = birthdayArray[0];
        let month = birthdayArray[1];
        let day = birthdayArray[2];
        // post data to API endpoint to signup

        this.httpClient.post(this.config.getAPILocation() + "/user/register", body).subscribe(data => {

          // if we got a response
          if (data) {

            this.httpClient.post(this.config.getAPILocation() + '/user/session', {email: this.email, password: this.password_1, remember_me: true}).subscribe(data => {

              // if there is a successful response
              if (data) {
                // remove surrounding quotes
                //data = data.substring(1, data.length - 1);
                console.log(data);
                // set the current user in localstorage to this user

                this.iam.setCurrentUser(data);

                let body = {
                  "resource": [
                    {
                      "id": localStorage.getItem('userID'),
                      "email": this.email,
                      "firstName": this.firstName,
                      "lastName": this.lastName,
                      "birthYear": year,
                      "birthMonth": month,
                      "birthDay": day,
                      "campusName": "Swarthmore College"
                    }
                  ],
                  "ids": [
                    0
                  ],
                  "filter": "string",
                  "params": [
                    "string"
                  ]
                }
                this.httpClient.post(this.config.getAPILocation() + '/rock/_table/userList?' + this.iam.getTokens(), body).subscribe(data => {
                  loading.dismiss();
                  this.response = data;
                  console.log(data);
                  console.log(this.response.resource[0].id);
                  if(this.response.resource[0].id==localStorage.getItem('userID')) {
                    let alert = this.alertCtrl.create({
                      title: 'Account Created!',
                      subTitle: 'Welcome to Rock!',
                      buttons: ['OK']
                    });
                    alert.present();
                    // move them to the main page
                    this.navCtrl.setRoot(HomePage);
                  } else {
                    let alert = this.alertCtrl.create({
                      title: 'Error',
                      subTitle: 'Sign up failed.',
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                })
              } else {
                // display error that login was unsuccessful
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Your login information was incorrect.',
                  buttons: ['OK']
                });
                alert.present();
              }
            }, error => {
              loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Your login information was incorrect.',
                buttons: ['OK']
              });
              alert.present();
            });
            // successful user registration, data equals user id
          } else {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Sign up failed.',
              buttons: ['OK']
            });
            alert.present();
          }
        }, error => {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Email already taken.',
            buttons: ['OK']
          });
          alert.present();
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
