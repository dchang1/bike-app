import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController, ViewController } from 'ionic-angular';

import { IAMService } from '../../services/iam.service';
import { ConfigService } from '../../services/config.service';

import { HomePage } from '../../pages/home/home';
import  moment from 'moment';

@Component({
  selector: 'page-ridehistory',
  templateUrl: 'ridehistory.html'
})
export class RideHistoryPage implements OnInit {
  public rides = [];
  public response: any = {};
  constructor(public viewCtrl: ViewController, private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService) {}

  ngOnInit() {
    // for(var i=0; i<5; i++) {
    //   let ride = {"ridePath": this.ridePath, "currentLatitude": this.currentLatitude, "currentLongitude": this.currentLongitude, "rideInfo": this.rideInfo}
    //   this.rides.push(ride);
    // }
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user/rides', {headers: headers}).subscribe(data => {
      this.response = data;
      this.rides = this.response.rides;
      console.log(this.rides);
      for(var i=0; i<this.rides.length; i++) {
        this.rides[i].startTime = moment(this.rides[i].startTime).format('MM/DD/YYYY');
        this.rides[i].distance = Math.round(this.rides[i].distance * 100)/100;
        this.rides[i].time = Math.round(this.rides[i].time * 6000)/100;
      }
    })
  }

  back() {
    this.navCtrl.setRoot(HomePage);
  }

}
