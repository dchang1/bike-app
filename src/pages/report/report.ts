import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, ViewController, NavParams } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})

export class ReportPage {

  public bikeNumber;
  public lock = false;
  public brakes = false;
  public tires = false;
  public spokes = false;
  public chains = false;
  public handles = false;
  public frame = false;
  public seat = false;
  public pedal = false;
  public lights = false;
  public kickstand = false;
  public other = false;
  public comments = "";
  public response: any = {};
  public results: any = {};
  options: BarcodeScannerOptions;

  constructor(private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, public viewCtrl: ViewController, public params: NavParams, private barcode: BarcodeScanner) {}

  public report() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.post(this.config.getAPILocation() + '/report', {bikeNumber: this.bikeNumber, lock: this.lock, brakes: this.brakes, tires: this.tires, spokes: this.spokes, chains: this.chains, handles: this.handles, frame: this.frame, seat: this.seat, pedal: this.pedal, lights: this.lights, kickstand: this.kickstand, other: this.other, comments: this.comments}, {headers: headers}).timeout(10000).subscribe(data => {
      this.response = data;
      if(this.response.success==true) {
        this.viewCtrl.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Report',
          subTitle: 'Thank you for submitting a report.',
          buttons: ['OK']
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Bike is not registered or does not exist.',
          buttons: ['OK']
        });
        alert.present();
      }
    }, error => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Could not connect to server.',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  async qr() {
    this.options = {
      prompt: "Scan a QR code!"
    }
    this.barcode.scan().then(results => {
      this.results = results;
      if(this.results.cancelled == false) {
        this.bikeNumber = this.results.text;
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
}
