import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import { AlertController, App } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { IAMService } from '../services/iam.service';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  public response: any = {};
  constructor(public app: App, private diagnostic: Diagnostic, private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, iam: IAMService) {
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
        if(nav.canGoBack()) {
          nav.pop();
        } else if (typeof nav.instance.backButtonAction === 'function') {
          nav.instance.back();
        } else {
          nav.setRoot(HomePage);
        }
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user', {headers: headers}).subscribe(data => {
      if(data) {
        this.response = data;
        console.log("Logged in");
        localStorage.setItem('totalDistance', this.response.user.totalDistance.toFixed(2).toString());
        localStorage.setItem('totalRideTime', this.response.user.totalRideTime.toFixed(2).toString());
        localStorage.setItem('totalRides', this.response.user.pastRides.length.toString());
        this.rootPage = HomePage;
/*
        this.diagnostic.isGpsLocationEnabled().then(state => {
          if (!state) {
            let confirm = this.alertCtrl.create({
              title: '<b>Location</b>',
              message: 'Location information is unavaliable on this device. Go to Settings to enable Location.',
              buttons: [
                {
                  text: 'cancel',
                  role: 'Cancel',
                  handler: () => {
                      this.rootPage = LandingPage;
                  }
                },
                {
                  text: 'Go to settings',
                  handler: () => {
                    this.diagnostic.switchToLocationSettings()
                  }
                }
              ]
            });
            confirm.present();
          }
          else {
            this.rootPage = HomePage;
          }
        })*/
      }
    }, error => {
      console.log("Not logged in");
      this.rootPage = LandingPage;
    })
  }
}
