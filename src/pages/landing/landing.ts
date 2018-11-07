import { Component, OnInit } from '@angular/core';
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

export class LandingPage implements OnInit{

  constructor(public modalCtrl: ModalController, private navCtrl: NavController, private httpClient: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private config: ConfigService, private iam: IAMService) {}
  error_message: string;

  email: string;
  password: string;
  public response: any = {};
  error: string = "";

  ngOnInit() {
    if(!this.iam.checkVerified() && this.iam.checkUser()) {
      let alert = this.alertCtrl.create({
        title: 'Verify your account',
        message: 'We sent a 4-digit verification code to ' + localStorage.getItem('email') + '. Please enter it in to verify your account.',
        inputs: [
          {
            name: 'verifyPIN',
            placeholder: '4-digit Code',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Verify',
            handler: data => {
              let headers = new HttpHeaders({
                'Authorization': localStorage.getItem('token')
              });
              this.httpClient.post(this.config.getAPILocation() + '/verify', {verifyPIN: data.verifyPIN}, {headers: headers}).subscribe(data => {
                this.response = data;
                console.log(this.response);
                if(this.response.success==true) {
                  console.log("CODE IS GOOD");
                  this.navCtrl.setRoot(HomePage);
                  alert.dismiss();
                  let secondAlert = this.alertCtrl.create({
                    title: "Account Verified!",
                    buttons: ['OK']
                  })
                  secondAlert.present();
                } else {
                  let secondAlert = this.alertCtrl.create({
                    title: "Wrong Code",
                    buttons: ['OK']
                  })
                  secondAlert.present();
                }
              });
              return false;
            }
          },
          {
            text: 'Resend',
            handler: () => {
              let headers = new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': localStorage.getItem('token')
              });
              this.httpClient.get(this.config.getAPILocation() + '/resend', {headers: headers}).subscribe(data => {
                let secondAlert = this.alertCtrl.create({
                  title: "Sent to " + localStorage.getItem('email'),
                  buttons: ['OK']
                })
                secondAlert.present();
              })
              return false;
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    }
  }

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
        if (this.response.success==true && this.response.verified==true) { //&& this.response.verified==true) {
          this.iam.setCurrentUser(this.response);
          let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
          });
          this.httpClient.get(this.config.getAPILocation() + '/campus/' + localStorage.getItem('campus'), {headers: headers}).subscribe(data => {
            this.response = data;
            if(this.response) {
              localStorage.setItem('geofence', JSON.stringify(this.response.geofence));
              this.navCtrl.setRoot(HomePage);
            }
          })
        } else if(this.response.verified==false) {
          this.iam.setCurrentUser(this.response);
          let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
          });
          this.httpClient.get(this.config.getAPILocation() + '/campus/' + localStorage.getItem('campus'), {headers: headers}).subscribe(data => {
            this.response = data;
            if(this.response) {
              localStorage.setItem('geofence', JSON.stringify(this.response.geofence));
            }
          })
          let alert = this.alertCtrl.create({
            title: 'Verify your account',
            message: 'We sent a 4-digit verification code to ' + localStorage.getItem('email') + '. Please enter it in to verify your account.',
            inputs: [
              {
                name: 'verifyPIN',
                placeholder: '4-digit Code',
                type: 'number'
              }
            ],
            buttons: [
              {
                text: 'Verify',
                handler: data => {
                  let headers = new HttpHeaders({
                    'Authorization': localStorage.getItem('token')
                  });
                  this.httpClient.post(this.config.getAPILocation() + '/verify', {verifyPIN: data.verifyPIN}, {headers: headers}).subscribe(data => {
                    this.response = data;
                    console.log(this.response);
                    if(this.response.success==true) {
                      console.log("CODE IS GOOD");
                      this.navCtrl.setRoot(HomePage);
                      alert.dismiss();
                      let secondAlert = this.alertCtrl.create({
                        title: "Account Verified!",
                        buttons: ['OK']
                      })
                      secondAlert.present();
                    } else {
                      let secondAlert = this.alertCtrl.create({
                        title: "Wrong Code",
                        buttons: ['OK']
                      })
                      secondAlert.present();
                    }
                  });
                  return false;
                }
              },
              {
                text: 'Resend',
                handler: () => {
                  let headers = new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': localStorage.getItem('token')
                  });
                  this.httpClient.get(this.config.getAPILocation() + '/resend', {headers: headers}).subscribe(data => {
                    let secondAlert = this.alertCtrl.create({
                      title: "Sent to " + localStorage.getItem('email'),
                      buttons: ['OK']
                    })
                    secondAlert.present();
                  })
                  return false;
                }
              },
              {
                text: 'Cancel',
                role: 'cancel'
              }
            ]
          });
          alert.present();
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
    this.navCtrl.push(ResetPage);
    //const modal = this.modalCtrl.create(ResetPage);
    //modal.present();
  }

  public signup() {
    this.navCtrl.push(RegisterPage);
  }

}
