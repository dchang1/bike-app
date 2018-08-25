import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { ModalController, NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { PaymentPage } from '../../pages/payment/payment';
import { SettingsPage } from '../../pages/settings/settings';
import { RideHistoryPage } from '../../pages/ridehistory/ridehistory';
import { HelpPage } from '../../pages/help/help';
import { LandingPage } from '../../pages/landing/landing'
import { BikeProfilePage } from '../../pages/bike-profile/bike-profile'
import { EndRidePage } from '../../pages/end-ride/end-ride'

import {BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  public latitude;
  public longitude;
  public rideInfo: any = {};
  public response: any = {};
  options: BarcodeScannerOptions;
  public results: any = {};
  public paths;
  public bikes: any = [];
  public firstName: string;
  public lastName: string;
  public campus: string;
  public totalDistance: number;
  public totalRideTime: number;
  public totalRides: number;
  public bikeScore: number;
  public inRide: boolean = false;
  public lines;
  public ridePath;
  public currentLatitude;
  public currentLongitude;
  public bikeNumber;
  public data;
  public rideTime = '0.00';
  public rideDistance = '0.00';
  public rideCalories = '0.00';
  public rideCost = '0.00';
  lat: number = 0;
  lng: number = 0;
  constructor(public modalCtrl: ModalController, private navCtrl: NavController, private httpClient: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private config: ConfigService, private iam: IAMService, private barcode: BarcodeScanner) {
  }
  ngOnInit() {
    this.firstName = localStorage.getItem("firstName");
    this.lastName = localStorage.getItem("lastName");
    this.campus = localStorage.getItem("campus");
    this.totalDistance = 10;
    this.totalRideTime = 5.32;
    this.totalRides = 2;
    this.bikeScore = 1;
    if(localStorage.getItem("inRide")=="true") {
      this.inRide=true;
    } else {
      this.inRide=false;
    }
    /*
    this.totalRideTime = localStorage.getItem("totalRideTime");
    this.totalDistance = localStorage.getItem("totalDistance");
    this.totalRides = localStorage.getItem("totalRides");
    */
    this.paths = [{lng: -75.3547847, lat: 39.8953987},
                {lng: -75.3531325,lat: 39.8952259},
                {lng: -75.352875,lat: 39.8986007},
                {lng: -75.3512871,lat: 39.8991357},
                {lng: -75.3501499,lat: 39.8994567},
                {lng: -75.349828,lat: 39.9011193},
                {lng: -75.3481972,lat: 39.901218},
                {lng: -75.3477359,lat: 39.9022304},
                {lng: -75.3477573,lat: 39.906148},
                {lng: -75.3515768,lat: 39.9067241},
                {lng: -75.351094,lat: 39.9087322},
                {lng: -75.3536367,lat: 39.9099914},
                {lng: -75.3547204,lat: 39.9098021},
                {lng: -75.3544199,lat: 39.9081068},
                {lng: -75.3566301,lat: 39.9073743},
                {lng: -75.3565657,lat: 39.9057118},
                {lng: -75.3553534,lat: 39.9044526},
                {lng: -75.3565979,lat: 39.9038271},
                {lng: -75.3576386,lat: 39.9039917},
                {lng: -75.3578639,lat: 39.9034567},
                {lng: -75.3574991,lat: 39.9027983}];
    this.lines = [
  {
    "lat": 39.90668,
    "lng": -75.35538
  },
  {
    "lat": 39.9065,
    "lng": -75.35518
  },
  {
    "lat": 39.90643,
    "lng": -75.35499
  },
  {
    "lat": 39.90637,
    "lng": -75.35495
  },
  {
    "lat": 39.90631,
    "lng": -75.35491
  },
  {
    "lat": 39.90628,
    "lng": -75.35487
  },
  {
    "lat": 39.90624,
    "lng": -75.35482
  },
  {
    "lat": 39.90621,
    "lng": -75.35478
  },
  {
    "lat": 39.90612,
    "lng": -75.3546
  },
  {
    "lat": 39.90607,
    "lng": -75.3545
  },
  {
    "lat": 39.906,
    "lng": -75.35438
  },
  {
    "lat": 39.90596,
    "lng": -75.35431
  },
  {
    "lat": 39.90594,
    "lng": -75.35427
  },
  {
    "lat": 39.90588,
    "lng": -75.35421
  },
  {
    "lat": 39.90583,
    "lng": -75.35415
  },
  {
    "lat": 39.9058,
    "lng": -75.35411
  },
  {
    "lat": 39.90577,
    "lng": -75.35407
  },
  {
    "lat": 39.90573,
    "lng": -75.35398
  },
  {
    "lat": 39.9057,
    "lng": -75.35389
  },
  {
    "lat": 39.90567,
    "lng": -75.35381
  },
  {
    "lat": 39.90564,
    "lng": -75.35374
  },
  {
    "lat": 39.90561,
    "lng": -75.35368
  },
  {
    "lat": 39.90552,
    "lng": -75.35352
  },
  {
    "lat": 39.90549,
    "lng": -75.35345
  },
  {
    "lat": 39.90549,
    "lng": -75.35346
  },
  {
    "lat": 39.90548,
    "lng": -75.35346
  },
  {
    "lat": 39.90548,
    "lng": -75.35347
  },
  {
    "lat": 39.90547,
    "lng": -75.35347
  },
  {
    "lat": 39.90546,
    "lng": -75.35347
  },
  {
    "lat": 39.90545,
    "lng": -75.35348
  },
  {
    "lat": 39.90544,
    "lng": -75.35348
  },
  {
    "lat": 39.90543,
    "lng": -75.35348
  },
  {
    "lat": 39.90543,
    "lng": -75.35347
  },
  {
    "lat": 39.90542,
    "lng": -75.35347
  },
  {
    "lat": 39.90541,
    "lng": -75.35347
  },
  {
    "lat": 39.90541,
    "lng": -75.35346
  },
  {
    "lat": 39.9054,
    "lng": -75.35346
  },
  {
    "lat": 39.90539,
    "lng": -75.35345
  },
  {
    "lat": 39.90538,
    "lng": -75.35344
  },
  {
    "lat": 39.90531,
    "lng": -75.35344
  },
  {
    "lat": 39.90526,
    "lng": -75.35342
  },
  {
    "lat": 39.90519,
    "lng": -75.35341
  },
  {
    "lat": 39.90516,
    "lng": -75.3534
  },
  {
    "lat": 39.90511,
    "lng": -75.35342
  },
  {
    "lat": 39.90509,
    "lng": -75.35342
  },
  {
    "lat": 39.905,
    "lng": -75.35347
  },
  {
    "lat": 39.90494,
    "lng": -75.35349
  },
  {
    "lat": 39.90487,
    "lng": -75.3535
  },
  {
    "lat": 39.90481,
    "lng": -75.35349
  },
  {
    "lat": 39.90476,
    "lng": -75.35348
  },
  {
    "lat": 39.9047,
    "lng": -75.35347
  },
  {
    "lat": 39.90467,
    "lng": -75.35347
  },
  {
    "lat": 39.90463,
    "lng": -75.35347
  },
  {
    "lat": 39.90457,
    "lng": -75.3535
  },
  {
    "lat": 39.90452,
    "lng": -75.35357
  },
  {
    "lat": 39.90447,
    "lng": -75.35363
  },
  {
    "lat": 39.90441,
    "lng": -75.35366
  },
  {
    "lat": 39.90435,
    "lng": -75.35367
  },
  {
    "lat": 39.90431,
    "lng": -75.35368
  },
  {
    "lat": 39.90426,
    "lng": -75.35365
  },
  {
    "lat": 39.90415,
    "lng": -75.35363
  },
  {
    "lat": 39.90406,
    "lng": -75.35361
  },
  {
    "lat": 39.904,
    "lng": -75.35361
  },
  {
    "lat": 39.90388,
    "lng": -75.35364
  },
  {
    "lat": 39.90378,
    "lng": -75.3537
  },
  {
    "lat": 39.90372,
    "lng": -75.35364
  },
  {
    "lat": 39.90369,
    "lng": -75.3536
  },
  {
    "lat": 39.90366,
    "lng": -75.35356
  },
  {
    "lat": 39.90362,
    "lng": -75.35352
  },
  {
    "lat": 39.90355,
    "lng": -75.35346
  },
  {
    "lat": 39.9035,
    "lng": -75.35342
  },
  {
    "lat": 39.90341,
    "lng": -75.35339
  },
  {
    "lat": 39.90335,
    "lng": -75.35338
  },
  {
    "lat": 39.90326,
    "lng": -75.35338
  },
  {
    "lat": 39.90314,
    "lng": -75.35341
  },
  {
    "lat": 39.90303,
    "lng": -75.35343
  },
  {
    "lat": 39.90299,
    "lng": -75.35343
  },
  {
    "lat": 39.90284,
    "lng": -75.35345
  },
  {
    "lat": 39.90247,
    "lng": -75.3535
  },
  {
    "lat": 39.90226,
    "lng": -75.3535
  },
  {
    "lat": 39.90217,
    "lng": -75.3535
  },
  {
    "lat": 39.90198,
    "lng": -75.3535
  },
  {
    "lat": 39.9019,
    "lng": -75.35351
  },
  {
    "lat": 39.90181,
    "lng": -75.3535
  },
  {
    "lat": 39.90177,
    "lng": -75.3535
  },
  {
    "lat": 39.90168,
    "lng": -75.3535
  },
  {
    "lat": 39.90159,
    "lng": -75.3535
  },
  {
    "lat": 39.90153,
    "lng": -75.35349
  },
  {
    "lat": 39.90152,
    "lng": -75.35371
  },
  {
    "lat": 39.90154,
    "lng": -75.35489
  },
  {
    "lat": 39.90155,
    "lng": -75.35504
  },
  {
    "lat": 39.90157,
    "lng": -75.35516
  }
]

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
    this.bikeNumber = number;
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
  public moreDetails(bike) {
    const modal = this.modalCtrl.create(BikeProfilePage, {bikeNumber: bike, reportBike: true, unlockBike: false});
    modal.present();
  }
  payment() {
    let alert = this.alertCtrl.create({
      title: 'Free Rides!',
      subTitle: 'All rides are free for now while we are in beta!',
      buttons: ['Ok']
    });
    alert.present();
  }
  help() {
    let alert = this.alertCtrl.create({
      title: 'Help',
      subTitle: 'Please email hlee6@swarthmore.edu for more information',
      buttons: ['Ok']
    });
    alert.present();
  }
  settings() {
    this.navCtrl.setRoot(SettingsPage);
  }
  ridehistory() {
    this.navCtrl.setRoot(RideHistoryPage);
  }
  logout() {
    this.iam.setCurrentUser(null);
    this.navCtrl.setRoot(LandingPage);
  }
  share() {
    let alert = this.alertCtrl.create({
      title: 'Share a bike!',
      subTitle: 'Please email hlee6@swarthmore.edu for more information',
      buttons: ['Ok']
    });
    alert.present();
  }
  reset() {
    localStorage.setItem('inRide', "false");
    this.inRide=false;
  }
  public test() {
    const modal = this.modalCtrl.create(EndRidePage);
    modal.present();
  }

  public distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  public scanQR() {
    console.log("QR");
    const modal = this.modalCtrl.create(BikeProfilePage, {bikeNumber: 977500, reportBike: false, unlockBike: true});
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if(data.unlock==true) {
        let loading = this.loadingCtrl.create({
          content: 'Unlocking Bike...'
        });
        loading.present();
        localStorage.setItem('inRide', "true");
        this.inRide=true;
        loading.dismiss();
        let test = 0;
        this.ridePath = [];
        let rideStartTime = Date.now();
        var currentRide = setInterval(() => {
          this.currentLatitude = this.lines[test].lat;
          this.currentLongitude = this.lines[test].lng;
          this.ridePath.push(this.lines[test]);
          let time = (Date.now() - rideStartTime)/60000;
          this.rideTime = time.toFixed(2);
          this.rideCalories = (650 * time / 60).toFixed(2);
          this.rideDistance = (this.distance(this.lines[0].lat, this.lines[1].lng, this.lines[test].lat, this.lines[test].lng)).toFixed(2);
          test++;
          console.log(test);
          if(test==20) {
            clearInterval(currentRide);
            localStorage.setItem('inRide', "false");
            this.inRide=false;
            const modal = this.modalCtrl.create(EndRidePage);
            modal.present();
          }
        }, 1000);
      }
    });
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
                var currentRide = setInterval(() => {
                  if(localStorage.getItem('inRide')=="true") {
                    let headers = new HttpHeaders({
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Authorization': localStorage.getItem('token')
                    });
                    this.httpClient.get(this.config.getAPILocation() + '/ride/' + localStorage.getItem('rideID'), {headers: headers}).subscribe(data => {
                      this.rideInfo = data;
                      if (this.rideInfo.ride.inRide==false) {
                        clearInterval(currentRide);
                        localStorage.setItem('inRide', "false");
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
            }, error => {
              loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Could not connect to server.',
                buttons: ['OK']
              });
              alert.present();
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
