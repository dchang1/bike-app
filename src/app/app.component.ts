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
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Deeplinks } from '@ionic-native/deeplinks';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  public response: any = {};
  constructor(private deeplinks: Deeplinks, private screenOrientation: ScreenOrientation, public app: App, private diagnostic: Diagnostic, private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, iam: IAMService) {
    platform.ready().then(() => {
      /*
      platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
        let activeView = nav.getActive();
        if(nav.canGoBack()) {
          nav.pop();
        } else if (typeof activeView.instance.backButtonAction === 'function') {
          activeView.instance.back();
        } else {
          nav.setRoot(HomePage);
        }
      });*/
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      /*
      this.deeplinks.route({
         '/verify/:token': LandingPage
       }).subscribe(match => {
         let headers = new HttpHeaders({
           'Authorization': localStorage.getItem('token')
         });
         this.httpClient.get(this.config.getAPILocation() + '/verify/' + match.$args.token, {headers: headers}).subscribe(data => {
           this.response = data;
           if(this.response.success==true) {
             let alert = this.alertCtrl.create({
               title: 'Success!',
               subTitle: 'Your account has been verified!',
               buttons: ['OK']
             });
             alert.present();
             this.rootPage = HomePage;
           } else {
             let alert = this.alertCtrl.create({
               title: 'Error',
               subTitle: 'Invalid',
               buttons: ['OK']
             });
             alert.present();
           }
         })
         // match.$route - the route we matched, which is the matched entry from the arguments to route()
         // match.$args - the args passed in the link
         // match.$link - the full link data
         console.log('Successfully matched route', match);
       }, nomatch => {
         // nomatch.$link - the full link data
         console.error('Got a deeplink that didn\'t match', nomatch);
       });*/

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user', {headers: headers}).subscribe(data => {
      if(data) {
        this.response = data;
        if(this.response.user.verified==true) {
          console.log("Logged in");
          localStorage.setItem('totalDistance', this.response.user.totalDistance.toFixed(2).toString());
          localStorage.setItem('totalRideTime', this.response.user.totalRideTime.toFixed(2).toString());
          localStorage.setItem('totalRides', this.response.user.pastRides.length.toString());
          this.rootPage = HomePage;
        } else {
          let alert = this.alertCtrl.create({
            title: 'Email not verified.',
            subTitle: 'Please click on the link provided in the email we sent.',
            buttons: [{text: 'Ok'},
                      {text: 'Resend',
                       handler: () => {
                         let headers = new HttpHeaders({
                           'Authorization': localStorage.getItem('token')
                         });
                         this.httpClient.get(this.config.getAPILocation() + '/resend', {headers: headers}).subscribe(data => {
                           console.log("sent");
                         })
                       }}] //resend email button
          });
          alert.present();
          this.rootPage = LandingPage;
        }
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
