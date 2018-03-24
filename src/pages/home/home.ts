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
import {BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';

     
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  latitude;
  longitude;
  options: BarcodeScannerOptions;
  results: {};
  constructor(private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService,private qrScanner: QRScanner, private barcode: BarcodeScanner) {
  }
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    })
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
  async qrscanner(){
    this.results = await this.qrScanner.scan();
    console.log(this.results)

  }
  async scanBarcode(){

    this.options = {
      prompt: "Scan a qr code!"
    }
    
    this.results = await this.barcode.scan();
    console.log(this.results)
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
