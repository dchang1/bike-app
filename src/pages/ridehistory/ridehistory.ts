import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { IAMService } from '../../services/iam.service';
import { ConfigService } from '../../services/config.service';

import { HomePage } from '../../pages/home/home';
@Component({
  selector: 'page-ridehistory',
  templateUrl: 'ridehistory.html'
})
export class RideHistoryPage implements OnInit {
  locations;

  constructor(private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService) {}

  ngOnInit() {
    // download the locations (once)
    /*this.httpClient.post(this.config.getAPILocation() + '/nearestStores', {}).subscribe(data => {
      if (data) {
        this.locations = data;
        console.log(this.locations);
      }
    });*/
    var info = [];
    for(var i=0; i<5; i++) {
      info.push({"name": "Name", "address": "Address", "time": "Time", "distance": "Distance", "latitude": 39.905022, "longitude": -75.354034});
    }
    this.locations = info;
    console.log(this.locations);
  }

  back() {
    this.navCtrl.setRoot(HomePage);
  }
}
