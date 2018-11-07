import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { HomePage } from '../../pages/home/home'
import { LandingPage } from '../../pages/landing/landing'

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
  campus: string = "";
  error_message: string = "";
  campuses: Array<string>;
  verifyPIN: number;
  public response: any = {};

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private httpClient: HttpClient, private alertCtrl: AlertController, private config: ConfigService, private iam: IAMService) {
    this.campuses = new Array<string>();
    this.campuses.push("Swarthmore");
  }

  public signUp() {
    if (this.firstName && this.lastName && this.email && this.password_1 && this.password_2 && this.campus!="") {
      if(this.password_1.length<6) {
        this.error_message = "Password must be at least 6 characters long.";
      }
      else if (this.password_1 == this.password_2) {
        this.error_message = "";
        let alert = this.alertCtrl.create({
        title: 'Accept Terms and Services',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non libero quis est efficitur luctus et eget tellus. Quisque risus nisl, molestie sed tellus dapibus, placerat consequat odio. Vestibulum nibh sapien, facilisis vitae est sit amet, interdum tincidunt mi. Integer egestas, massa vitae suscipit lobortis, purus purus vulputate erat, in volutpat ante ipsum eget dolor. Sed efficitur velit sed quam eleifend, id elementum massa tempor. In a tristique nulla. Morbi in odio at sapien pellentesque mollis quis sed elit. Pellentesque sit amet turpis et augue fermentum imperdiet. Nam nec pretium nisl, vel euismod diam.Etiam quis augue posuere diam volutpat euismod. Nunc id sapien ut elit fermentum placerat id sit amet mi. Integer neque dui, fringilla a luctus eget, ornare ut diam. Proin vehicula lacus sit amet augue tincidunt, in porta neque ultricies. Pellentesque eu lorem sit amet purus commodo egestas non venenatis ex. Etiam feugiat enim at purus tincidunt, malesuada suscipit nibh malesuada. Aenean dapibus dui accumsan, semper magna ut, interdum neque. Vivamus bibendum nisi maximus ante tempus consectetur a sed dolor. Mauris elementum massa ut orci condimentum, at consequat magna suscipit. In a diam ut erat tincidunt placerat id ac massa. Suspendisse sed pellentesque dolor. Praesent aliquam commodo augue id egestas. Praesent sed ex a lorem vestibulum fermentum at eu tortor. Praesent mattis facilisis eros sit amet finibus. Morbi id tellus convallis, ultrices mi sit amet, volutpat justo.Vivamus tempus ornare tortor, eget laoreet ante. Fusce ac lectus eget nisi tincidunt rutrum vel sed lorem. Donec ac urna volutpat velit consequat viverra sed id nisl. Donec id condimentum erat. Phasellus in dictum elit, accumsan luctus felis. Ut non augue id lorem ultrices sagittis. Donec tincidunt vulputate mattis. Donec condimentum mi ut elementum condimentum. Donec eget nulla enim. Nulla vitae ante in nunc venenatis pellentesque non ac est. Nam vitae ante finibus, dapibus nunc at, auctor quam. Nam id accumsan purus. Vestibulum tincidunt ut nibh quis aliquet. Donec tincidunt, erat at mollis euismod, nisi nisi vehicula dolor, aliquet sodales lacus est at odio.In hac habitasse platea dictumst. Pellentesque ac diam vel ipsum cursus facilisis. Donec leo ipsum, volutpat cursus luctus at, pretium at orci. Duis tristique orci in augue scelerisque imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas eget sodales felis. Proin metus lacus, porta id quam a, pulvinar molestie felis. Cras auctor pretium metus, ut eleifend sem rhoncus nec. Pellentesque vel risus vitae mauris mattis feugiat ac quis ex. Maecenas pellentesque ipsum lacus, et egestas sem pulvinar eu. Vestibulum vestibulum dui nec dictum volutpat. Nulla nec ultrices eros. Cras eget consectetur ligula, non tristique sapien. Nullam ullamcorper laoreet nunc, vitae pellentesque leo. Proin vehicula metus non dui porta, vulputate venenatis justo mollis.Vivamus eget elit vel mauris facilisis tempor blandit eget lacus. Nunc non vulputate enim, at ornare lorem. Donec lobortis mi non ipsum aliquam, quis elementum elit maximus. Etiam mattis magna sed arcu ultrices, non imperdiet est imperdiet. Quisque sed dolor ex. Pellentesque quis tellus eget ipsum commodo porta. Suspendisse non ipsum gravida, tincidunt massa et, hendrerit nisi. Sed ultrices, quam eu tempus ornare, arcu lectus finibus nulla, ultricies dignissim mi dolor sit amet ligula. Morbi nibh nibh, porta a viverra ac, venenatis consequat neque. Duis at bibendum nisl. In vestibulum mattis lectus, quis posuere mauris pharetra vitae.',
        buttons: [
            {
              text: 'Disagree',
              handler: () => {
                this.navCtrl.pop();
              }
            },
            {
              text: 'Agree',
              handler: () => {
                let loading = this.loadingCtrl.create({
                  content: 'Please wait...'
                });
                loading.present();
                let body = {
                  firstName: this.firstName,
                  lastName: this.lastName,
                  email: this.email,
                  campus: this.campus,
                  password: this.password_1
                }
                console.log(body);
                this.httpClient.post(this.config.getAPILocation() + "/signup", body).subscribe(data => {
                  loading.dismiss();
                  this.response = data;
                  if(this.response.success==true) {
                    console.log(this.response);
                    this.iam.setCurrentUser(this.response);
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
                          handler: () => {
                            this.navCtrl.setRoot(LandingPage);
                          }
                        }
                      ]
                    });
                    alert.present();
                  } else if(this.response.success==false) {
                    console.log(this.response);
                    let alert = this.alertCtrl.create({
                      title: 'Error',
                      subTitle: this.response.message,
                      buttons: ['Ok']
                    });
                    alert.present();
                  }
                }, error => {
                  loading.dismiss();
                  let alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'Could not connect to server.',
                    buttons: ['OK']
                  });
                  alert.present();
                });
              }
            }
          ]
        });
        alert.present();
      } else {
        this.error_message = "Passwords do not match";
      }
    } else {
      // all fields were not filled out
      this.error_message = "Please fill out all fields";
    }
  }

  public back() {
    this.navCtrl.pop();
  }
}
