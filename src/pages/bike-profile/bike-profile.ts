import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController, ViewController, NavParams } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-bike-profile',
  templateUrl: 'bike-profile.html'
})

export class BikeProfilePage implements OnInit {
  public bikeProfile;
  public header;
  public reportBike;
  public unlockBike;

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService, public viewCtrl: ViewController, public params: NavParams) {
  }

  ngOnInit() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.reportBike = this.params.get('reportBike');
    this.unlockBike = this.params.get('unlockBike')
    this.httpClient.get(this.config.getAPILocation() + '/bike/' + this.params.get('bikeNumber'), {headers: headers}).subscribe(data => {
      this.bikeProfile = data;
      this.bikeProfile = this.bikeProfile.bike;
      if(this.bikeProfile) {
        console.log(this.bikeProfile);
        this.bikeProfile.totalHours = Math.round(this.bikeProfile.totalHours/3600 * 100) / 100;
        this.bikeProfile.totalDistance = Math.round(this.bikeProfile.totalDistance * 100) / 100;
        if(this.bikeProfile.owner && this.bikeProfile.owner != "") {
          this.header = this.bikeProfile.owner + "\'s Bike";
        } else {
          this.header = "Bike Details";
        }
      }
      else {
        console.log("nothing");
      }
    }, error => {
      console.log("ERROR");
    });
  }

  public dismiss() {
    this.viewCtrl.dismiss({"unlock": false});
  }

  public report() {
    let alert = this.alertCtrl.create({
      title: 'Report',
      subTitle: 'Please email hlee6@swarthmore.edu with the problem.',
      buttons: ['OK']
    });
    alert.present();
  }

  public unlock() {
    this.viewCtrl.dismiss({"unlock": true});
  }
}
