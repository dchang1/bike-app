import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../services/config.service';

import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { IAMService } from '../services/iam.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  public response: any = {};
  constructor(private httpClient: HttpClient, private config: ConfigService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, iam: IAMService) {
    platform.ready().then(() => {
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
        localStorage.setItem('totalDistance', Math.round(this.response.user.totalDistance*100)/100);
        localStorage.setItem('totalRideTime', Math.round(this.response.user.totalRideTime*100)/100);
        localStorage.setItem('totalRides', this.response.user.pastRides.length);
        this.rootPage = HomePage;
      }
    }, error => {
      console.log("Not logged in");
      this.rootPage = LandingPage;
    })
  }
}
