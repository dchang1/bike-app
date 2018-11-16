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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  public response: any = {};
  constructor(private screenOrientation: ScreenOrientation, public app: App, private diagnostic: Diagnostic, private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, iam: IAMService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user', {headers: headers}).subscribe(data => {
      if(data) {
        this.response = data;
        if(this.response.verified) {

          this.diagnostic.isLocationEnabled().then(state => {
            if (!state) {
              let confirm = this.alertCtrl.create({
                title: '<b>Location</b>',
                message: 'Location information is unavaliable on this device. Go to Settings to enable Location.',
                buttons: [
                  {
                    text: 'cancel',
                    role: 'Cancel'
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
          })

          this.rootPage = HomePage;
        } else {
          this.rootPage = LandingPage;
        }
      }


/*
        this.diagnostic.getBluetoothState().then((state) => {
          if (state == this.diagnostic.bluetoothState.POWERED_ON){
            this.rootPage = HomePage;
          } else {
            let confirm = this.alertCtrl.create({
              title: '<b>Bluetooth</b>',
              message: 'Bluetooth is required for this application. Please enable bluetooth.',
              buttons: ['OK']
            });
            confirm.present();
          }
        }, error => {
          console.log("no bluetooth");
        })
        */

    }, error => {
      console.log("Not logged in");
      this.rootPage = LandingPage;
    })
  }
}
