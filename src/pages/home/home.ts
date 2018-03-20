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

// QR scanner
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

//constructor(private qrScanner: QRScanner) { }

/*
// Optionally request the permission early
this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted


       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

       // show camera preview
       this.qrScanner.show();

       // wait for user to scan something, then the observable callback will be called

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => console.log('Error is', e));
*/

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  constructor(private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService) {
  }
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      //this.latitude = position.coords.latitude;
      //this.longitude = position.coords.longitude;
    });
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
}
