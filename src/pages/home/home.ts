import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { PaymentPage } from '../../pages/payment/payment';
import { SettingsPage } from '../../pages/settings/settings';
import { RideHistoryPage } from '../../pages/ridehistory/ridehistory';
import { HelpPage } from '../../pages/help/help';
import { LandingPage } from '../../pages/landing/landing'

import {BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  latitude;
  longitude;
  public rideInfo: any = {};
  public response: any = {};
  options: BarcodeScannerOptions;
  public results: any = {};
  public bikes: any = [];
  public firstName: string;
  public lastName: string;
  public campus: string;
  public totalDistance: number;
  public totalRideTime: number;
  public totalRides: number;
  public bikeScore: number;
  constructor(private navCtrl: NavController, private httpClient: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private config: ConfigService, private iam: IAMService, private barcode: BarcodeScanner) {
  }
  ngOnInit() {
    this.firstName = localStorage.getItem("firstName");
    this.lastName = localStorage.getItem("lastName");
    this.campus = localStorage.getItem("campus");
    this.totalDistance = 10;
    this.totalRideTime = 5.32;
    this.totalRides = 2;
    this.bikeScore = 1;
    /*
    this.totalRideTime = localStorage.getItem("totalRideTime");
    this.totalDistance = localStorage.getItem("totalDistance");
    this.totalRides = localStorage.getItem("totalRides");
    this.bikeScore = localStorage.getItem("bikeScore");
    */
    navigator.geolocation.getCurrentPosition(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(this.latitude);
      console.log(this.longitude);
    });
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/allCampusBikes', {headers: headers}).subscribe(data => {
      this.bikes = data;
      this.bikes = this.bikes.bikes;
      if(this.bikes) {
        console.log(this.bikes);
      }
    }, error => {
      console.log("ERROR");
    });
    /*
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(this.latitude);
        console.log(this.longitude);
      });
      let headers = new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.get(this.config.getAPILocation() + '/allCampusBikes', {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response) {
          console.log(data);
        }
      }, error => {
        console.log("ERROR");
      });
    }, 5000);
    */
  }
  public bikeProfile(infoWindow, gm, number) {
    console.log("bike");
    console.log(number);
    if (gm.lastOpen != null) {
            gm.lastOpen.close();
        }

        gm.lastOpen = infoWindow;

        infoWindow.open();
  }

  public closeProfiles(gm) {
    if(gm.lastOpen) {
      gm.lastOpen.close();
    }
  }
  payment() {
    this.navCtrl.setRoot(PaymentPage);
  }
  help() {
    this.navCtrl.setRoot(HelpPage);
  }
  settings() {
    this.navCtrl.setRoot(SettingsPage);
  }
  ridehistory() {
    this.navCtrl.setRoot(RideHistoryPage);
  }
  logout() {
    // remove the user from localStorage and move them to the landing page
    this.iam.setCurrentUser(null);
    this.navCtrl.setRoot(LandingPage);
  }
  scanQR() {
    console.log("QR");
  }
  async scanBarcode(){

    this.options = {
      prompt: "Scan a qr code!"
    }
    this.results = await this.barcode.scan();
    console.log(this.results);

    let alert = this.alertCtrl.create({
      title: 'New ride',
      message: 'Do you want to unlock bike #' + this.results.text + '?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            let headers = new HttpHeaders({
              'Authorization': localStorage.getItem('token')
            });
            let loading = this.loadingCtrl.create({
              content: 'Unlocking Bike...'
            });
            loading.present();
            this.httpClient.post(this.config.getAPILocation() + '/newRide', {bike: 977500}, {headers: headers}).subscribe(data => {
              this.response = data;
              if(this.response.success==true) {
                loading.dismiss();
                localStorage.setItem('inRide', "true");
                localStorage.setItem('rideID', this.response.rideID);
                localStorage.setItem('bikeNumber', this.response.bike);
                setInterval(() => {
                  if(localStorage.getItem('inRide')=="true") {
                    let headers = new HttpHeaders({
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Authorization': localStorage.getItem('token')
                    });
                    this.httpClient.get(this.config.getAPILocation() + '/ride/' + localStorage.getItem('rideID'), {headers: headers}).subscribe(data => {
                      this.rideInfo = data;
                      if (this.rideInfo.ride.inRide==false) {
                        localStorage.setItem('inRide', "true");
                        let alert = this.alertCtrl.create({
                          title: 'Ride finished!',
                          buttons: ['OK']
                        });
                        alert.present();
                      } else {
                          console.log("still in ride");
                      }
                    });
                  }
                }, 1000);
              } else {
                loading.dismiss();
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Bike does not exist or it could not be unlock.',
                  buttons: ['OK']
                });
                alert.present();
              }
            })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    alert.present();

  }

  /*
  getBikeData() { //replace 731053 with the bike number from scanning qr code
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.httpClient.get(this.config.getAPILocation() + '/rock/_table/bikeList?fields=*&filter=bikeNumber%20=%20%27' + "731053" + "%27&" + this.iam.getTokens()).subscribe(data => {
      this.response = data;
      localStorage.setItem('bike', JSON.stringify(this.response.resource[0]));
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Scanned Bike',
        subTitle: 'You are riding' + JSON.parse(localStorage.getItem('bike')).bikeName,
        buttons: ['OK']
      });
      //All of below information is stored in localStorage
      //To get anyone of this data just do JSON.parse(localStorage.getItem('bike')).bikeName

    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Invalid Bike',
        buttons: ['OK']
      });
      alert.present();
    })
  }

  getGeofence() {
    this.httpClient.get(this.config.getAPILocation() + '/rock/_table/campusList?filter=id%20=%20%27' + JSON.parse(localStorage.getItem('bike')).campusId + "%27&" + this.iam.getTokens()).subscribe(data => {
      this.response = data;
      localStorage.setItem('geofence', JSON.stringify(this.response.resource[0]));
      console.log(JSON.parse(localStorage.getItem('geofence')));
    })
  }
  */
  newRide() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    let loading = this.loadingCtrl.create({
      content: 'Unlocking Bike...'
    });
    loading.present();
    this.httpClient.post(this.config.getAPILocation() + '/newRide', {bike: 977500}, {headers: headers}).subscribe(data => {
      this.response = data;
      if(this.response.success==true) {
        loading.dismiss();
        localStorage.setItem('inRide', "true");
        localStorage.setItem('rideID', this.response.rideID);
        localStorage.setItem('bikeNumber', this.response.bike);
        setInterval(() => {
          if(localStorage.getItem('inRide')=="true") {
            let headers = new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': localStorage.getItem('token')
            });
            this.httpClient.get(this.config.getAPILocation() + '/ride/' + localStorage.getItem('rideID'), {headers: headers}).subscribe(data => {
              this.rideInfo = data;
              if (this.rideInfo.ride.inRide==false) {
                localStorage.setItem('inRide', "true");
                let alert = this.alertCtrl.create({
                  title: 'Ride finished!',
                  buttons: ['OK']
                });
                alert.present();
              } else {
                  console.log("still in ride");
              }
            });
          }
        }, 1000);
      } else {
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Bike did not unlock.',
          buttons: ['OK']
        });
        alert.present();
      }
    })
  }

  unlockBike() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let body = "arg=" + localStorage.getItem('rideID') + "&access_token" + localStorage.getItem('particleToken');
    this.httpClient.post("https://api.particle.io/v1/devices/" + JSON.parse(localStorage.getItem('bike')).lockId + "/u", body, {headers: headers}).subscribe(data => {
      console.log(data);
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Bike is unlocked',
        subTitle: 'Begin riding!',
        buttons: ['OK']
      });

    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Did not unlock bike',
        buttons: ['OK']
      });
      alert.present();
    })
  }

/*
  qrscanner() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          alert('authorized');

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            alert(text);
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

          this.qrScanner.resumePreview();

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
            alert('denied');
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          alert('else');
        }
      })
      .catch((e: any) => {
        alert('Error is' + e);
      });

  }
  */


}
