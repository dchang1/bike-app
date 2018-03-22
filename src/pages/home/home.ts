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
// QR scanner
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


     
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  constructor(private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService,private qrScanner: QRScanner) {
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
  logout() {
    // remove the user from localStorage and move them to the landing page
    this.iam.setCurrentUser(null);
    this.navCtrl.setRoot(LandingPage);
  }
  qrScan(status: QRScannerStatus) {
       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

       // show camera preview
       this.qrScanner.show();

       // wait for user to scan something, then the observable callback will be called

  }

}
