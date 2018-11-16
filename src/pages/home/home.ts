import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, App, ModalController, NavController, LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/timeout';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { SettingsPage } from '../../pages/settings/settings';
import { RideHistoryPage } from '../../pages/ridehistory/ridehistory';
import { LandingPage } from '../../pages/landing/landing'
import { EndRidePage } from '../../pages/end-ride/end-ride'
import { SafetyPage } from '../../pages/safety/safety'
import { ReportPage } from '../../pages/report/report'

import { Geolocation } from '@ionic-native/geolocation';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { BLE } from '@ionic-native/ble';
import { Diagnostic } from '@ionic-native/diagnostic';
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  public latitude: any;
  public longitude: any;
  public rideInfo: any = {};
  public response: any = {};
  public bikeData: any = {};
  public bikeResponse: any = {};
  options: BarcodeScannerOptions;
  public results: any = {};
  public paths;
  public bikes: any = [];
  public firstName: string;
  public lastName: string;
  public campus: string;
  public totalRideHours = '0';
  public totalRideMinutes = '00';
  public totalRideDistance = '0';
  public totalRideDistanceDecimal = '00';
  public totalRides;
  public bikeType;
  public bikeScore: number;
  public inRide: boolean = false;
  public lines;
  public ridePath;
  public currentLatitude;
  public currentLongitude;
  public bikeNumber;
  public data;
  public geofence;
  public hubs: any = [];
  public rideTime = 0;
  public rideDistance = 0;
  public rideCalories = 0;
  public rideHours;
  public rideMinutes = '00';
  public rideSeconds = '00';
  public rideCost = '0.00';
  public rideDistanceDecimal = '00';
  lat: number = 0;
  lng: number = 0;
  protected map: any;
  public unregisterBackButtonAction: any;
  public world;
  public color;
  public bikePreviewClass;
  public bikeProfileClass;
  public bikeProfileArrow = 'assets/arrow-down.png';
  public bikeProfileFunction = 'showBikeProfile()';
  public devices: any[] = [];
  public statusMessage: string;
  public bleMAC;
  public peripheral;
  public bikeProfile: any = {};


  constructor(private diagnostic: Diagnostic, private ble: BLE, private ngZone: NgZone, public platform: Platform, public app: App, public geolocation: Geolocation, public modalCtrl: ModalController, private navCtrl: NavController, private httpClient: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private config: ConfigService, private iam: IAMService, private barcode: BarcodeScanner) {
  }
  ngOnInit() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user', {headers: headers}).subscribe(data => {
      if(data) {
        this.iam.updateCurrentUser(data);
      }
    });
    this.firstName = localStorage.getItem("firstName");
    this.lastName = localStorage.getItem("lastName");
    this.campus = localStorage.getItem("campus");
    this.totalRides = localStorage.getItem("totalRides");
    this.totalRideHours = localStorage.getItem("totalRideHours");
    this.totalRideMinutes = localStorage.getItem("totalRideMinutes");
    this.totalRideDistance = localStorage.getItem("totalRideDistance");
    this.totalRideDistanceDecimal = localStorage.getItem("totalRideDistanceDecimal");
    this.bikeScore = 1;
    this.latitude = Number(localStorage.getItem('latitude'));
    this.longitude = Number(localStorage.getItem('longitude'));
    this.geofence = JSON.parse(localStorage.getItem('geofence'));
    this.color = "#31b2f7";
    this.bikePreviewClass = "hide";
    let headers1 = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/hubs', {headers: headers1}).subscribe(data => {
      this.hubs = data;
      this.hubs = this.hubs.hubs;
      console.log(this.hubs);
    });
    if(localStorage.getItem("inRide")=="true") {
      this.inRide=true;
      this.bikePreviewClass = "hide";
      this.bikeProfileArrow = "assets/arrow-down.png";
      this.bikeProfileClass = "slideUp";
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
              this.inRide=false;
              const modal = this.modalCtrl.create(EndRidePage, {bikeType: this.bikeType, rideSeconds: this.rideSeconds, rideMinutes: this.rideMinutes, rideHours: this.rideHours, rideDistance: this.rideDistance, rideDistanceDecimal: this.rideDistanceDecimal, ridePath: this.ridePath});
              this.rideSeconds = '00';
              this.rideMinutes = '00';
              this.rideHours = 0;
              this.rideDistance = 0;
              this.rideDistanceDecimal = '00';
              modal.present();
            } else {
                this.currentLatitude = this.rideInfo.ride.route[this.rideInfo.ride.route.length-1][0];
                this.currentLongitude = this.rideInfo.ride.route[this.rideInfo.ride.route.length-1][1];
                this.ridePath = this.rideInfo.ride.route;
                this.rideSeconds = this.pad(Math.floor((moment().valueOf() - moment(this.rideInfo.ride.startTime).valueOf())/1000) % 60);
                this.rideMinutes = this.pad(Math.floor(parseInt(this.rideSeconds)/60) % 60);
                this.rideHours = Math.floor(parseInt(this.rideMinutes)/60);
                this.rideDistance = Math.round((this.distance(this.rideInfo.ride.startPosition[0], this.rideInfo.ride.startPosition[1], this.currentLatitude, this.currentLongitude))*100)/100;
                this.rideDistanceDecimal = (this.rideDistance.toString().split(".")[1]);
                if(this.rideDistanceDecimal) {
                  if(this.rideDistanceDecimal.length == 1) {
                    this.rideDistanceDecimal += "0";
                  }
                } else {
                  this.rideDistanceDecimal = "00";
                }
                this.rideDistance = Math.floor(this.rideDistance);
            }
          });
        }
      }, 1000);
    } else {
      this.inRide=false;
    }

    this.world = [{"lat": 90, "lng": 90}, {"lat": 90, "lng": -90}, {"lat": 0, "lng": 90}, {"lat": 0, "lng": -90}];
    this.paths = [this.world, this.geofence];
    this.lines=[[39.90668, -75.35538],[39.9065, -75.35518],[39.90643, -75.35499],[39.90637, -75.35495],[39.90631, -75.35491],[39.90628, -75.35487],[39.90624, -75.35482],[39.90621, -75.35478],[39.90612, -75.3546],[39.90607, -75.3545],[39.906, -75.35438],[39.90596, -75.35431],[39.90594, -75.35427],[39.90588, -75.35421],[39.90583, -75.35415],[39.9058, -75.35411],[39.90577, -75.35407],[39.90573, -75.35398],[39.9057, -75.35389],[39.90567, -75.35381],[39.90564, -75.35374],[39.90561, -75.35368],[39.90552, -75.35352],[39.90549, -75.35345],[39.90549, -75.35346],[39.90548, -75.35346],[39.90548, -75.35347],[39.90547, -75.35347],[39.90546, -75.35347],[39.90545, -75.35348],[39.90544, -75.35348],[39.90543, -75.35348],[39.90543, -75.35347],[39.90542, -75.35347],[39.90541, -75.35347],[39.90541, -75.35346],[39.9054, -75.35346],[39.90539, -75.35345],[39.90538, -75.35344],[39.90531, -75.35344],[39.90526, -75.35342],[39.90519, -75.35341],[39.90516, -75.3534],[39.90511, -75.35342],[39.90509, -75.35342],[39.905, -75.35347],[39.90494, -75.35349],[39.90487, -75.3535],[39.90481, -75.35349],[39.90476, -75.35348],[39.9047, -75.35347],[39.90467, -75.35347],[39.90463, -75.35347],[39.90457, -75.3535],[39.90452, -75.35357],[39.90447, -75.35363],[39.90441, -75.35366],[39.90435, -75.35367],[39.90431, -75.35368],[39.90426, -75.35365],[39.90415, -75.35363],[39.90406, -75.35361],[39.904, -75.35361],[39.90388, -75.35364],[39.90378, -75.3537],[39.90372, -75.35364],[39.90369, -75.3536],[39.90366, -75.35356],[39.90362, -75.35352],[39.90355, -75.35346],[39.9035, -75.35342],[39.90341, -75.35339],[39.90335, -75.35338],[39.90326, -75.35338],[39.90314, -75.35341],[39.90303, -75.35343],[39.90299, -75.35343],[39.90284, -75.35345],[39.90247, -75.3535],[39.90226, -75.3535],[39.90217, -75.3535],[39.90198, -75.3535],[39.9019, -75.35351],[39.90181, -75.3535],[39.90177, -75.3535],[39.90168, -75.3535],[39.90159, -75.3535],[39.90153, -75.35349],[39.90152, -75.35371],[39.90154, -75.35489],[39.90155, -75.35504],[39.90157, -75.35516]];

/*
    this.diagnostic.isLocationEnabled().then(state => {
      if (!state) {
        this.latitude = Number(localStorage.getItem('geofenceCenterLat'));
        this.longitude = Number(localStorage.getItem('geofenceCenterLng'));
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
      } else {
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
         // data can be a set of coordinates, or an error (if an error occurred).
           console.log(data.coords.latitude)
           this.latitude = data.coords.latitude;
           this.longitude = data.coords.longitude;
           localStorage.setItem('latitude', data.coords.latitude.toString());
           localStorage.setItem('longitude', data.coords.longitude.toString());
           // data.coords.longitude
        });
      }
    })
*/


    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
     // data can be a set of coordinates, or an error (if an error occurred).
       console.log(data.coords.latitude)
       this.latitude = data.coords.latitude;
       this.longitude = data.coords.longitude;
       localStorage.setItem('latitude', data.coords.latitude.toString());
       localStorage.setItem('longitude', data.coords.longitude.toString());
       // data.coords.longitude
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

    var getBikes = setInterval(() => {
      if(!localStorage.getItem("session")) {
        clearInterval(getBikes);
      }
      let headers = new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.get(this.config.getAPILocation() + '/allCampusBikes', {headers: headers}).subscribe(data => {
        this.bikeData = data;
        if(this.bikeData.bikes.length != this.bikes.length) {
          this.bikes = this.bikeData.bikes;
          this.map.lastOpen = null;
        }
        console.log(this.bikes);

      }, error => {
        console.log("ERROR");
      });
    }, 60000);
  }
  public openBikePreview(number) {
    this.bikePreviewClass = "slideInDown";
    this.bikeProfile = this.bikes.find(x=> x.number == number);
    this.bikeProfile.totalDistance = Math.round(this.bikeProfile.totalDistance * 100)/100;
    this.bikeProfile.rideHours = Math.floor(this.bikeProfile.totalHours).toString();
    this.bikeProfile.rideMinutes = this.pad(Math.floor((this.bikeProfile.totalHours % 1) * 60));
    //this.bikeProfile.rideSeconds = this.pad(Math.floor((((this.bikeProfile.totalHours % 1) * 60) % 1) * 60));
  }
  public showBikeProfile() {
    if(this.bikeProfileClass == "slideDown") {
      this.bikeProfileClass = "slideUp";
      this.bikeProfileArrow = "assets/arrow-down.png";
      console.log("profile");
    } else {
      this.bikeProfileClass = "slideDown";
      this.bikeProfileArrow = "assets/arrow-up.png";
      console.log("close profile");
    }
  }
  public closeBikePreview() {
    this.bikePreviewClass = "hide";
    this.bikeProfileArrow = "assets/arrow-down.png";
    this.bikeProfileClass = "slideUp";
  }
  public swipeEvent(event) {
    //direction of 16 means down, 24 is up
    console.log(event.direction);
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
      subTitle: 'Please email support@hive.bike for more information.',
      buttons: ['Ok']
    });
    alert.present();
  }
  settings() {
    this.navCtrl.push(SettingsPage);
  }
  ridehistory() {
    this.navCtrl.push(RideHistoryPage);
  }
  logout() {
    this.iam.setCurrentUser(null);
    this.navCtrl.setRoot(LandingPage);
  }
  share() {
    let alert = this.alertCtrl.create({
      title: 'Share a bike!',
      subTitle: 'Please email support@hive.bike for more information.',
      buttons: ['Ok']
    });
    alert.present();
  }
  report() {
    this.navCtrl.push(ReportPage);
  }
  reset() {
    localStorage.setItem('inRide', "false");
    this.inRide=false;
  }
  protected mapReady(map) {
    this.map = map;
  }
  center() {
    if (this.map) {
      this.map.setCenter({ lat: this.latitude, lng: this.longitude });
      this.map.setZoom(16);
    }
  }
  public distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  ionViewDidEnter() {
        this.initializeBackButtonCustomHandler();
    }
  ionViewWillLeave() {
        // Unregister the custom back button action for this page
      this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
          this.customHandleBackButton();
      }, 10);
  }

  private customHandleBackButton(): void {
    let nav = this.app.getActiveNav();
    if(nav.canGoBack()) {
      nav.pop();
    } else {
      nav.setRoot(HomePage);
    }
  }

  public stringToArrayBuffer(str){
      if(/[\u0080-\uffff]/.test(str)){
          throw new Error("this needs encoding, like UTF-8");
      }
      var arr = new Uint8Array(str.length);
      for(var i=str.length; i--; )
          arr[i] = str.charCodeAt(i);
      return arr.buffer;
  }

  public arrayBufferToString(buffer){
      var arr = new Uint8Array(buffer);
      var str = String.fromCharCode.apply(String, arr);
      if(/[\u0080-\uffff]/.test(str)){
          throw new Error("this string seems to contain (still encoded) multibytes");
      }
      return str;
  }

  public pad(num) {
    var s = "0" + num;
    return s.substr(s.length-2);
  }

  public padAfter(num) {
    var s = num + "0";
    return s.substr(s.length-2);
  }

  public safety() {
    const modal = this.modalCtrl.create(SafetyPage, {showBackdrop: true, enableBackdropDismiss: true});
    modal.present();
  }

  //WORKING WITH BLUETOOTH
  async bleScan() {
    this.diagnostic.getBluetoothState().then((state) => {
      if (state == this.diagnostic.bluetoothState.POWERED_ON){
        this.options = {
          prompt: "Scan a QR code!"
        }
        this.devices = [];
        this.ble.startScan([]).subscribe(
          device => this.onDeviceDiscovered(device),
          error => this.scanError(error)
        );
        this.barcode.scan().then(results => {
          this.results = results;
          if(this.results.cancelled == false) {
            let headers = new HttpHeaders({
              'Authorization': localStorage.getItem('token')
            });
            this.httpClient.get(this.config.getAPILocation() + '/bike/' + this.results.text, {headers: headers}).subscribe(data => {
              this.bikeResponse = data;
              if(this.bikeResponse.success==true) {
                this.bikeType = this.bikeResponse.bike.type;
                const modal = this.modalCtrl.create(SafetyPage, {showBackdrop: true, enableBackdropDismiss: true});
                modal.present();
                this.httpClient.get(this.config.getAPILocation() + '/bleMAC/' + 977500, {headers: headers}).subscribe(data => {
                  this.response = data;
                  if(this.response.success==true) {
                    this.bleMAC = this.response.bleMAC;
                    this.ble.stopScan();
                    modal.onDidDismiss(data => {
                      if(data.unlock==true) {
                        let loading = this.loadingCtrl.create({
                          content: 'Unlocking Bike...'
                        });
                        loading.present();
                        this.ble.connect(this.bleMAC).subscribe(
                          peripheral => this.connected(peripheral, loading),
                          peripheral => this.onDeviceDiscovered(peripheral)
                        );
                      }
                    });
                  }
                })
              }
            })
          }
        }).catch(err => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Scanning failed: ' + err,
            buttons: ['OK']
          });
          alert.present();
        })
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
  }

  connected(peripheral, loading) {
    this.peripheral = peripheral;
    let buffer = this.stringToArrayBuffer("davidchang");
    this.ble.write(this.peripheral.id, '6E400001-B5A3-F393-E0A9-E50E24DCCA9E', '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', buffer).then(
      () => {
        let headers = new HttpHeaders({
          'Authorization': localStorage.getItem('token')
        });
        this.httpClient.post(this.config.getAPILocation() + '/newBLERide', {bike: this.results.text}, {headers: headers}).timeout(10000).subscribe(data => {
          this.response = data;
          if(this.response.success==true) {
            localStorage.setItem('inRide', "true");
            this.inRide=true;
            this.bikePreviewClass = "hide";
            this.bikeProfileArrow = "assets/arrow-down.png";
            this.bikeProfileClass = "slideUp";
            localStorage.setItem('rideID', this.response.rideID);
            localStorage.setItem('bikeNumber', this.response.bike);
            loading.dismiss();
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
                    this.inRide=false;
                    const modal = this.modalCtrl.create(EndRidePage, {bikeType: this.bikeType, rideSeconds: this.rideSeconds, rideMinutes: this.rideMinutes, rideHours: this.rideHours, rideDistance: this.rideDistance, rideDistanceDecimal: this.rideDistanceDecimal, ridePath: this.ridePath});
                    this.rideSeconds = '00';
                    this.rideMinutes = '00';
                    this.rideHours = 0;
                    this.rideDistance = 0;
                    this.rideDistanceDecimal = '00';
                    modal.present();
                  } else {
                      this.currentLatitude = this.rideInfo.ride.route[this.rideInfo.ride.route.length-1][0];
                      this.currentLongitude = this.rideInfo.ride.route[this.rideInfo.ride.route.length-1][1];
                      this.ridePath = this.rideInfo.ride.route;
                      this.rideSeconds = this.pad(Math.floor((moment().valueOf() - moment(this.rideInfo.ride.startTime).valueOf())/1000) % 60);
                      this.rideMinutes = this.pad(Math.floor(parseInt(this.rideSeconds)/60) % 60);
                      this.rideHours = Math.floor(parseInt(this.rideMinutes)/60);
                      this.rideDistance = Math.round((this.distance(this.rideInfo.ride.startPosition[0], this.rideInfo.ride.startPosition[1], this.currentLatitude, this.currentLongitude))*100)/100;
                      this.rideDistanceDecimal = (this.rideDistance.toString().split(".")[1]);
                      if(this.rideDistanceDecimal) {
                        if(this.rideDistanceDecimal.length == 1) {
                          this.rideDistanceDecimal += "0";
                        }
                      } else {
                        this.rideDistanceDecimal = "00";
                      }
                      this.rideDistance = Math.floor(this.rideDistance);
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
      },
      e => {
        let alert = this.alertCtrl.create({
          title: 'ERROR',
          message: 'Couldnt write ' + e,
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    })
  }

  scanError(error) {
    let alert = this.alertCtrl.create({
      title: 'ERROR',
      message: error,
      buttons: ['OK']
    });
    alert.present();
  }

  //New demo with fake data NO UNLOCKING ONLY SCANNING
  async scanQR() {
    this.options = {
      prompt: "Scan a QR code!"
    }
    this.barcode.scan().then(results => {
      this.results = results;
      if(this.results.cancelled == false) {
        let headers = new HttpHeaders({
          'Authorization': localStorage.getItem('token')
        });
        this.httpClient.get(this.config.getAPILocation() + '/bike/' + this.results.text, {headers: headers}).subscribe(data => {
          this.bikeResponse = data;
          if(this.bikeResponse.success==true) {
            this.bikeType = this.bikeResponse.bike.type;
            const modal = this.modalCtrl.create(SafetyPage, {showBackdrop: true, enableBackdropDismiss: true});
            modal.present();
            modal.onDidDismiss(data => {
              if(data.unlock==true) {
                let loading = this.loadingCtrl.create({
                  content: 'Unlocking Bike...'
                });
                loading.present();
                localStorage.setItem('inRide', "true");
                this.inRide=true;
                this.bikePreviewClass = "hide";
                this.bikeProfileArrow = "assets/arrow-down.png";
                this.bikeProfileClass = "slideUp";
                loading.dismiss();
                let test = 0;
                this.ridePath = [];
                let rideStartTime = Date.now();
                var currentRide = setInterval(() => {
                  this.currentLatitude = this.lines[test][0];
                  this.currentLongitude = this.lines[test][1];
                  this.ridePath.push(this.lines[test]);
                  this.rideSeconds = this.pad(Math.floor((Date.now() - rideStartTime)/1000) % 60);
                  this.rideMinutes = this.pad(Math.floor(parseInt(this.rideSeconds)/60) % 60);
                  this.rideHours = Math.floor(parseInt(this.rideMinutes)/60);
                  this.rideDistance = Math.round((this.distance(this.lines[0][0], this.lines[0][1], this.lines[test][0], this.lines[test][1]))*100)/100;
                  this.rideDistanceDecimal = (this.rideDistance.toString().split(".")[1]);
                  if(this.rideDistanceDecimal) {
                    if(this.rideDistanceDecimal.length == 1) {
                      this.rideDistanceDecimal += "0";
                    }
                  } else {
                    this.rideDistanceDecimal = "00";
                  }
                  this.rideDistance = Math.floor(this.rideDistance);
                  test++;
                  if(test==20) {
                    clearInterval(currentRide);
                    localStorage.setItem('inRide', "false");
                    this.inRide=false;
                    const modal = this.modalCtrl.create(EndRidePage, {bikeType: this.bikeType, rideSeconds: this.rideSeconds, rideMinutes: this.rideMinutes, rideHours: this.rideHours, rideDistance: this.rideDistance, rideDistanceDecimal: this.rideDistanceDecimal, ridePath: this.ridePath});
                    this.rideSeconds = '00';
                    this.rideMinutes = '00';
                    this.rideHours = 0;
                    this.rideDistance = 0;
                    this.rideDistanceDecimal = '00';
                    modal.present();
                  }
                }, 1000);
              }
            });
          } else {
            let alert = this.alertCtrl.create({
              title: 'Invalid QR Code',
              subTitle: 'Bike is not registered or does not exist.',
              buttons: ['OK']
            });
            alert.present();
          }
        }, error => {
          let alert = this.alertCtrl.create({
            title: 'Not online',
            subTitle: 'Please go online to unlock the bike.',
            buttons: ['OK']
          });
          alert.present();
        });
      }
    }).catch(err => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Scanning failed: ' + err,
        buttons: ['OK']
      });
      alert.present();
    })
  }

  //DEMO WITHOUT HAVING TO SCAN
  async test() {
    console.log("TEST()");
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/bike/' + 977500, {headers: headers}).subscribe(data => {
      this.bikeResponse = data;
      if(this.bikeResponse.success==true) {
        this.bikeType = this.bikeResponse.bike.type;
        const modal = this.modalCtrl.create(SafetyPage, {showBackdrop: true, enableBackdropDismiss: true});
        modal.present();
        modal.onDidDismiss(data => {
          if(data.unlock==true) {
            let loading = this.loadingCtrl.create({
              content: 'Unlocking Bike...'
            });
            loading.present();
            localStorage.setItem('inRide', "true");
            this.inRide=true;
            this.bikePreviewClass = "hide";
            this.bikeProfileArrow = "assets/arrow-down.png";
            this.bikeProfileClass = "slideUp";
            loading.dismiss();
            let test = 0;
            this.ridePath = [];
            let rideStartTime = Date.now();
            var currentRide = setInterval(() => {
              this.currentLatitude = this.lines[test][0];
              this.currentLongitude = this.lines[test][1];
              this.latitude = this.currentLatitude;
              this.longitude = this.currentLongitude;
              this.ridePath.push(this.lines[test]);
              this.rideSeconds = this.pad(Math.floor((Date.now() - rideStartTime)/1000) % 60);
              this.rideMinutes = this.pad(Math.floor(parseInt(this.rideSeconds)/60) % 60);
              this.rideHours = Math.floor(parseInt(this.rideMinutes)/60);
              this.rideDistance = Math.round((this.distance(this.lines[0][0], this.lines[0][1], this.lines[test][0], this.lines[test][1]))*100)/100;
              this.rideDistanceDecimal = (this.rideDistance.toString().split(".")[1]);
              if(this.rideDistanceDecimal) {
                if(this.rideDistanceDecimal.length == 1) {
                  this.rideDistanceDecimal += "0";
                }
              } else {
                this.rideDistanceDecimal = "00";
              }
              this.rideDistance = Math.floor(this.rideDistance);
              test++;
              if(test==20) {
                clearInterval(currentRide);
                localStorage.setItem('inRide', "false");
                this.inRide=false;
                const modal = this.modalCtrl.create(EndRidePage, {demo: true, bikeType: this.bikeType, rideSeconds: this.rideSeconds, rideMinutes: this.rideMinutes, rideHours: this.rideHours, rideDistance: this.rideDistance, rideDistanceDecimal: this.rideDistanceDecimal, ridePath: this.ridePath});
                this.rideSeconds = '00';
                this.rideMinutes = '00';
                this.rideHours = 0;
                this.rideDistance = 0;
                this.rideDistanceDecimal = '00';
                modal.present();
              }
            }, 1000);
          }
        });
      } else {
        let alert = this.alertCtrl.create({
          title: 'Invalid QR Code',
          subTitle: 'Bike is not registered or does not exist.',
          buttons: ['OK']
        });
        alert.present();
      }
    }, error => {
      let alert = this.alertCtrl.create({
        title: 'Not online',
        subTitle: 'Please go online to unlock the bike.',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  //CREATE ACTUAL NEW RIDE TEST
  async testBLE() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/bike/600521', {headers: headers}).subscribe(data => {
      this.bikeResponse = data;
      if(this.bikeResponse.success==true) {
        this.bikeType = this.bikeResponse.bike.type;
        const modal = this.modalCtrl.create(SafetyPage, {showBackdrop: true, enableBackdropDismiss: true});
        modal.present();
        modal.onDidDismiss(data => {
          if(data.unlock==true) {
            let loading = this.loadingCtrl.create({
              content: 'Unlocking Bike...'
            });
            loading.present();
            this.httpClient.post(this.config.getAPILocation() + '/newBLERide', {bike: '600521'}, {headers: headers}).timeout(10000).subscribe(data => {
              this.response = data;
              if(this.response.success==true) {
                localStorage.setItem('inRide', "true");
                this.inRide=true;
                this.bikePreviewClass = "hide";
                this.bikeProfileArrow = "assets/arrow-down.png";
                this.bikeProfileClass = "slideUp";
                localStorage.setItem('rideID', this.response.rideID);
                localStorage.setItem('bikeNumber', this.response.bike);
                loading.dismiss();
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
                        this.inRide=false;
                        const modal = this.modalCtrl.create(EndRidePage, {bikeType: this.bikeType, rideSeconds: this.rideSeconds, rideMinutes: this.rideMinutes, rideHours: this.rideHours, rideDistance: this.rideDistance, rideDistanceDecimal: this.rideDistanceDecimal, ridePath: this.ridePath});
                        this.rideSeconds = '00';
                        this.rideMinutes = '00';
                        this.rideHours = 0;
                        this.rideDistance = 0;
                        this.rideDistanceDecimal = '00';
                        modal.present();
                      } else {
                          this.currentLatitude = this.rideInfo.ride.route[this.rideInfo.ride.route.length-1][0];
                          this.currentLongitude = this.rideInfo.ride.route[this.rideInfo.ride.route.length-1][1];
                          this.ridePath = this.rideInfo.ride.route;
                          this.rideSeconds = this.pad(Math.floor((moment().valueOf() - moment(this.rideInfo.ride.startTime).valueOf())/1000) % 60);
                          this.rideMinutes = this.pad(Math.floor(parseInt(this.rideSeconds)/60) % 60);
                          this.rideHours = Math.floor(parseInt(this.rideMinutes)/60);
                          this.rideDistance = Math.round((this.distance(this.rideInfo.ride.startPosition[0], this.rideInfo.ride.startPosition[1], this.currentLatitude, this.currentLongitude))*100)/100;
                          this.rideDistanceDecimal = (this.rideDistance.toString().split(".")[1]);
                          if(this.rideDistanceDecimal) {
                            if(this.rideDistanceDecimal.length == 1) {
                              this.rideDistanceDecimal += "0";
                            }
                          } else {
                            this.rideDistanceDecimal = "00";
                          }
                          this.rideDistance = Math.floor(this.rideDistance);
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
        })
      }
    })
  }

  async demo() {
    this.diagnostic.getBluetoothState().then((state) => {
      if (state == this.diagnostic.bluetoothState.POWERED_ON){
        this.options = {
          prompt: "Scan a QR code!"
        }
        this.devices = [];
        this.ble.startScan([]).subscribe(
          device => this.onDeviceDiscovered(device),
          error => this.scanError(error)
        );
        this.barcode.scan().then(results => {
          this.results = results;
          if(this.results.cancelled == false) {
            let headers = new HttpHeaders({
              'Authorization': localStorage.getItem('token')
            });
            this.httpClient.get(this.config.getAPILocation() + '/bike/' + this.results.text, {headers: headers}).subscribe(data => {
              this.bikeResponse = data;
              if(this.bikeResponse.success==true) {
                this.bikeType = this.bikeResponse.bike.type;
                const modal = this.modalCtrl.create(SafetyPage, {showBackdrop: true, enableBackdropDismiss: true});
                modal.present();
                this.httpClient.get(this.config.getAPILocation() + '/bleMAC/' + 977500, {headers: headers}).subscribe(data => {
                  this.response = data;
                  if(this.response.success==true) {
                    this.bleMAC = this.response.bleMAC;
                    this.ble.stopScan();
                    modal.onDidDismiss(data => {
                      if(data.unlock==true) {
                        let loading = this.loadingCtrl.create({
                          content: 'Unlocking Bike...'
                        });
                        loading.present();
                        this.ble.connect(this.bleMAC).subscribe(
                          peripheral => this.connectedDemo(peripheral, loading),
                          peripheral => this.onDeviceDiscovered(peripheral)
                        );
                      }
                    });
                  }
                })
              }
            })
          }
        }).catch(err => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Scanning failed: ' + err,
            buttons: ['OK']
          });
          alert.present();
        })
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
  }

  connectedDemo(peripheral, loading) {
    this.peripheral = peripheral;
    let buffer = this.stringToArrayBuffer("davidchang");
    this.ble.write(this.peripheral.id, '6E400001-B5A3-F393-E0A9-E50E24DCCA9E', '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', buffer).then(
      () => {
        let headers = new HttpHeaders({
          'Authorization': localStorage.getItem('token')
        });
        this.httpClient.post(this.config.getAPILocation() + '/newBLERide', {bike: this.results.text}, {headers: headers}).timeout(10000).subscribe(data => {
          this.response = data;
          if(this.response.success==true) {
            localStorage.setItem('inRide', "true");
            this.inRide=true;
            this.bikePreviewClass = "hide";
            this.bikeProfileArrow = "assets/arrow-down.png";
            this.bikeProfileClass = "slideUp";
            loading.dismiss();
            let test = 0;
            this.ridePath = [];
            let rideStartTime = Date.now();
            var currentRide = setInterval(() => {
              this.currentLatitude = this.lines[test][0];
              this.currentLongitude = this.lines[test][1];
              this.latitude = this.currentLatitude;
              this.longitude = this.currentLongitude;
              this.ridePath.push(this.lines[test]);
              this.rideSeconds = this.pad(Math.floor((Date.now() - rideStartTime)/1000) % 60);
              this.rideMinutes = this.pad(Math.floor(parseInt(this.rideSeconds)/60) % 60);
              this.rideHours = Math.floor(parseInt(this.rideMinutes)/60);
              this.rideDistance = Math.round((this.distance(this.lines[0][0], this.lines[0][1], this.lines[test][0], this.lines[test][1]))*100)/100;
              this.rideDistanceDecimal = (this.rideDistance.toString().split(".")[1]);
              if(this.rideDistanceDecimal) {
                if(this.rideDistanceDecimal.length == 1) {
                  this.rideDistanceDecimal += "0";
                }
              } else {
                this.rideDistanceDecimal = "00";
              }
              this.rideDistance = Math.floor(this.rideDistance);
              test++;
              if(test==20) {
                clearInterval(currentRide);
                localStorage.setItem('inRide', "false");
                this.inRide=false;
                const modal = this.modalCtrl.create(EndRidePage, {demo: true, bikeType: this.bikeType, rideSeconds: this.rideSeconds, rideMinutes: this.rideMinutes, rideHours: this.rideHours, rideDistance: this.rideDistance, rideDistanceDecimal: this.rideDistanceDecimal, ridePath: this.ridePath});
                this.rideSeconds = '00';
                this.rideMinutes = '00';
                this.rideHours = 0;
                this.rideDistance = 0;
                this.rideDistanceDecimal = '00';
                modal.present();
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
      },
      e => {
        let alert = this.alertCtrl.create({
          title: 'ERROR',
          message: 'Couldnt write ' + e,
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

}
